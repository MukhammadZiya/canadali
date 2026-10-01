"use client";

/** Sidebar navigation for the admin area — client only for the active state. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarRange,
  Inbox,
  Newspaper,
  Trophy,
  UserRound,
} from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: BarChart3 },
  { href: "/admin/profile", label: "Profile", Icon: UserRound },
  { href: "/admin/stories", label: "Success Stories", Icon: Trophy },
  { href: "/admin/news", label: "News Manager", Icon: Newspaper },
  { href: "/admin/consultation", label: "Consultation Info", Icon: CalendarRange },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox },
] as const;

export default function AdminNav({ newInquiries }: { newInquiries: number }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ITEMS.map(({ href, label, Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-navy-800 text-white"
                : "text-slate-300 hover:bg-navy-800/60 hover:text-white"
            }`}
          >
            <Icon size={17} strokeWidth={1.9} />
            <span className="flex-1">{label}</span>
            {label === "Inquiries" && newInquiries > 0 && (
              <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-950">
                {newInquiries}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
