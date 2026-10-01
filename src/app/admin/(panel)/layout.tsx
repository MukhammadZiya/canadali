/**
 * Admin shell: dark sidebar + content area for every (panel) page.
 * Authentication is enforced by src/middleware.ts before any of this
 * renders; the layout only draws chrome. The login page lives outside this
 * route group precisely so it does not inherit the sidebar.
 */
import Link from "next/link";
import { ExternalLink, LogOut, Scale } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { logout } from "@/actions/auth";
import { readDb } from "@/lib/db";

export const metadata = { title: "Admin · Carter Immigration Law" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = readDb();
  const newInquiries = db.inquiries.filter((q) => q.status === "new").length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-gold-400">
            <Scale size={18} strokeWidth={1.8} />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-sm font-bold text-white">
              Carter Law
            </span>
            <span className="block text-[10px] tracking-[0.25em] text-slate-400 uppercase">
              Admin
            </span>
          </span>
        </Link>

        <div className="mt-8 flex-1">
          <AdminNav newInquiries={newInquiries} />
        </div>

        <div className="space-y-1 border-t border-navy-800 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-navy-800/60 hover:text-white"
          >
            <ExternalLink size={17} strokeWidth={1.9} /> View public site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-navy-800/60 hover:text-white"
            >
              <LogOut size={17} strokeWidth={1.9} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Compact top bar for small screens, where the sidebar is hidden. */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/admin" className="font-display text-sm font-bold text-navy-900">
            Carter Law · Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-slate-500">Site</Link>
            <form action={logout}>
              <button className="text-slate-500">Sign out</button>
            </form>
          </div>
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
