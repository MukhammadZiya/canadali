/**
 * A tiny JSON-file database.
 *
 * Everything the site knows lives in data/db.json. Reads parse the file;
 * writes go to a temp file and are renamed into place, so a crash mid-write
 * can never leave half a document behind. This is deliberately simple — a
 * single-lawyer site does not need Postgres, and the whole store swaps out
 * for Prisma later by reimplementing the four functions in this file.
 *
 * All functions are server-only: they touch the filesystem and must never be
 * imported into a client component.
 */
import fs from "fs";
import path from "path";
import type { Analytics, Db } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

/** Mulberry32 — a tiny seeded RNG so the demo analytics look organic but are
 *  identical on every machine (no Math.random, no test flakiness). */
function seededRandom(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** First run only: backfill 60 days of plausible traffic so the dashboard
 *  charts demonstrate themselves instead of rendering an empty axis. Real
 *  tracking increments on top of this baseline. */
function seedAnalytics(db: Db): boolean {
  if (db.analytics.dailyViews.length > 0) return false;

  const rand = seededRandom(20261001);
  const days: Analytics["dailyViews"] = [];
  const today = new Date();
  let visitors = 0;

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    // Weekday traffic beats weekends; a slow upward trend across the window.
    const base = weekday === 0 || weekday === 6 ? 38 : 85;
    const trend = (59 - i) * 0.6;
    const views = Math.round(base + trend + rand() * 40);
    const dayVisitors = Math.round(views * (0.55 + rand() * 0.15));
    visitors += dayVisitors;
    days.push({ date: d.toISOString().slice(0, 10), views, visitors: dayVisitors });
  }

  const totalViews = days.reduce((sum, d) => sum + d.views, 0);
  db.analytics.dailyViews = days;
  db.analytics.visitors = visitors;
  db.analytics.submissions = 23;
  // Distribute the historical views across pages in realistic proportions.
  db.analytics.pageTotals = {
    "/": Math.round(totalViews * 0.42),
    "/consultation": Math.round(totalViews * 0.21),
    "/news": Math.round(totalViews * 0.17),
    "/success-stories": Math.round(totalViews * 0.14),
    "/news/express-entry-category-draws-2026": Math.round(totalViews * 0.06),
  };
  return true;
}

export function readDb(): Db {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Db;
  if (seedAnalytics(db)) writeDb(db);
  return db;
}

export function writeDb(db: Db): void {
  // Temp file + rename = atomic on the same filesystem. A crash between the
  // two steps leaves the old file intact rather than a truncated one.
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmp, DB_PATH);
}

/** Read–modify–write in one step so call sites cannot forget the write. */
export function updateDb<T>(mutate: (db: Db) => T): T {
  const db = readDb();
  const result = mutate(db);
  writeDb(db);
  return result;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
