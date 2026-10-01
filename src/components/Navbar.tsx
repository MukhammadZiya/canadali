"use client";

/**
 * Public site navigation. Client component for one reason only: the mobile
 * menu toggle. Links highlight from usePathname so the active page is always
 * visible.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Scale, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/news", label: "News & Updates" },
  { href: "/consultation", label: "Consultation" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-900 text-gold-400">
            <Scale size={18} strokeWidth={1.8} />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[15px] font-bold text-navy-900">
              Carter Immigration Law
            </span>
            <span className="block text-[11px] tracking-widest text-slate-500 uppercase">
              Toronto · Canada
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-navy-50 text-navy-900"
                  : "text-slate-600 hover:bg-navy-50 hover:text-navy-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/consultation" className="btn-gold ml-3 !px-5 !py-2.5">
            Book a Consultation
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-navy-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-navy-100 bg-white px-4 pb-4 pt-2 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                isActive(link.href)
                  ? "bg-navy-50 text-navy-900"
                  : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="btn-gold mt-2 w-full"
          >
            Book a Consultation
          </Link>
        </nav>
      )}
    </header>
  );
}
