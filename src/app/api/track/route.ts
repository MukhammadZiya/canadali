/**
 * Page-view tracking, called once per page load by <PageViewTracker>.
 *
 * Counts a view against the path and the daily series, and counts a visitor
 * once per browser via a long-lived cookie. No IPs, no fingerprinting, no
 * third parties — the only thing stored is "some browser saw this path".
 */
import { NextRequest, NextResponse } from "next/server";
import { updateDb } from "@/lib/db";

const VISITOR_COOKIE = "vid";

export async function POST(request: NextRequest) {
  let payloadPath = "/";
  try {
    const body = await request.json();
    if (typeof body.path === "string") payloadPath = body.path;
  } catch {
    // Malformed body — still count it as a home-page view rather than 500ing.
  }

  // Normalise: admin pages are the lawyer working, not audience traffic, and
  // belong nowhere near the visitor statistics.
  const path = payloadPath.split("?")[0].slice(0, 120);
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true });
  }

  const isNewVisitor = !request.cookies.get(VISITOR_COOKIE)?.value;
  const today = new Date().toISOString().slice(0, 10);

  updateDb((db) => {
    db.analytics.pageTotals[path] = (db.analytics.pageTotals[path] ?? 0) + 1;

    let day = db.analytics.dailyViews.at(-1);
    if (!day || day.date !== today) {
      day = { date: today, views: 0, visitors: 0 };
      db.analytics.dailyViews.push(day);
      // Keep a rolling ~90-day window so the file never grows forever.
      if (db.analytics.dailyViews.length > 90) {
        db.analytics.dailyViews = db.analytics.dailyViews.slice(-90);
      }
    }
    day.views += 1;
    if (isNewVisitor) {
      day.visitors += 1;
      db.analytics.visitors += 1;
    }
  });

  const response = NextResponse.json({ ok: true });
  if (isNewVisitor) {
    response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return response;
}
