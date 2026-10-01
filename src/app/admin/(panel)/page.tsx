/**
 * Admin dashboard: the numbers a solo practice actually acts on — traffic,
 * where it goes, and whether it turns into consultation requests.
 */
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Inbox,
  MousePointerClick,
  Users,
} from "lucide-react";
import TrafficChart from "@/components/admin/TrafficChart";
import { formatDateTime, formatNumber } from "@/lib/format";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/consultation": "Consultation",
  "/news": "News index",
  "/success-stories": "Success stories",
};

export default function AdminDashboard() {
  const db = readDb();
  const { analytics } = db;

  const totalViews = Object.values(analytics.pageTotals).reduce((a, b) => a + b, 0);
  const last7 = analytics.dailyViews.slice(-7).reduce((sum, d) => sum + d.views, 0);
  const conversion =
    analytics.visitors > 0
      ? ((analytics.submissions / analytics.visitors) * 100).toFixed(1)
      : "0.0";

  const topPages = Object.entries(analytics.pageTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxPage = topPages[0]?.[1] ?? 1;

  const recentInquiries = db.inquiries.slice(0, 5);

  const stats = [
    { label: "Total page views", value: formatNumber(totalViews), hint: `${formatNumber(last7)} in the last 7 days`, Icon: Eye },
    { label: "Unique visitors", value: formatNumber(analytics.visitors), hint: "Counted once per browser", Icon: Users },
    { label: "Form submissions", value: formatNumber(analytics.submissions), hint: "Consultation requests, lifetime", Icon: Inbox },
    { label: "Conversion rate", value: `${conversion}%`, hint: "Submissions ÷ visitors", Icon: MousePointerClick },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Traffic and engagement across the public site.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, hint, Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {label}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <Icon size={16} />
              </span>
            </div>
            <div className="font-display mt-3 text-3xl font-bold text-navy-900">
              {value}
            </div>
            <div className="mt-1 text-xs text-slate-400">{hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Traffic chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy-900">
              Traffic — last {db.analytics.dailyViews.length} days
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-navy-700" /> Views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gold-500" /> Visitors
              </span>
            </div>
          </div>
          <div className="mt-4">
            <TrafficChart data={analytics.dailyViews} />
          </div>
        </div>

        {/* Most-visited pages */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-navy-900">Most-visited pages</h2>
          <ul className="mt-4 space-y-4">
            {topPages.map(([path, views]) => (
              <li key={path}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">
                    {PAGE_NAMES[path] ?? path}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatNumber(views)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-navy-700 to-navy-600"
                    style={{ width: `${Math.max(6, (views / maxPage) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900">Latest inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-navy-600"
          >
            Manage all <ArrowRight size={13} />
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No inquiries yet — they will appear here as soon as the public
            form is used.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {inquiry.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        inquiry.status === "new"
                          ? "bg-gold-100 text-gold-600"
                          : inquiry.status === "contacted"
                            ? "bg-navy-50 text-navy-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {inquiry.service} · {inquiry.email}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatDateTime(inquiry.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
