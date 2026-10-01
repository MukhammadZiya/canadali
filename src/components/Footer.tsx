/**
 * Site footer — server component. Contact details and social links come from
 * the profile record, so the lawyer edits them in the admin panel and they
 * change here on every page at once.
 */
import Link from "next/link";
import { Mail, MapPin, Phone, Scale } from "lucide-react";
import {
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/SocialIcons";
import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { href: profile.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: profile.social.twitter, label: "Twitter / X", Icon: XIcon },
    { href: profile.social.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-navy-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Identity */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-gold-400">
              <Scale size={18} strokeWidth={1.8} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Carter Immigration Law
            </span>
          </div>
          <div className="maple-rule mt-4" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {profile.title} practising in Toronto, Ontario. Serving clients
            across Canada and worldwide.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-800 text-slate-300 transition hover:bg-gold-500 hover:text-navy-950"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
              <span>{profile.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold-500" />
              <a href={`tel:${profile.phone}`} className="hover:text-white">
                {profile.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold-500" />
              <a href={`mailto:${profile.email}`} className="hover:text-white">
                {profile.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
            <li><Link href="/news" className="hover:text-white">Immigration News</Link></li>
            <li><Link href="/consultation" className="hover:text-white">Book a Consultation</Link></li>
            <li><Link href="/admin" className="text-slate-500 hover:text-slate-300">Client Portal / Admin</Link></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer + copyright */}
      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-400">Legal disclaimer:</strong> The
            content of this website is provided for general information only
            and does not constitute legal advice. Reading this site, or
            contacting the firm through it, does not create a
            solicitor–client relationship. Immigration outcomes depend on the
            facts of each case and on policies that change frequently; past
            results do not guarantee a similar outcome. For advice about your
            situation, book a consultation.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} Carter Immigration Law Professional
            Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
