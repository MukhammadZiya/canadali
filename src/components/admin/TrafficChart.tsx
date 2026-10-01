"use client";

/**
 * The traffic graph on the admin dashboard — views and unique visitors over
 * the rolling window. Recharts must run on the client; the server page hands
 * it plain data.
 */
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyViews } from "@/lib/types";

export default function TrafficChart({ data }: { data: DailyViews[] }) {
  const series = data.map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00").toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={series} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#173766" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#173766" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2a04f" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#c2a04f" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: 12.5,
            boxShadow: "0 8px 24px rgba(15,23,42,.08)",
          }}
        />
        <Area
          type="monotone"
          dataKey="views"
          name="Page views"
          stroke="#173766"
          strokeWidth={2}
          fill="url(#views)"
        />
        <Area
          type="monotone"
          dataKey="visitors"
          name="Visitors"
          stroke="#c2a04f"
          strokeWidth={2}
          fill="url(#visitors)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
