/**
 * Home page: hero + credentials, philosophy, stats, featured success
 * stories, latest news, and the consultation call-to-action. Everything is
 * read from the database at request time, so admin edits appear immediately
 * after their revalidation.
 */
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import NewsCard from "@/components/NewsCard";
import StoryCard from "@/components/StoryCard";
import { readDb } from "@/lib/db";

// Content changes through the admin panel at runtime; never prerender stale.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = readDb();
  const { profile } = db;
  const stories = db.stories.filter((s) => s.published).slice(0, 3);
  const news = db.news.filter((a) => a.published).slice(0, 3);
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-28">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold-400 uppercase">
              <ShieldCheck size={14} /> Licensed Canadian immigration counsel
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="font-display mt-2 text-xl text-gold-400">
              {profile.title}
            </p>
            <div className="maple-rule mt-6" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
              {profile.bio.split("\n")[0]}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/consultation" className="btn-gold">
                <CalendarCheck size={17} /> Book a Consultation
              </Link>
              <Link href="/success-stories" className="btn-outline !border-navy-700 !text-slate-200 hover:!bg-navy-900 hover:!border-navy-600">
                See client results
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-gold-500" /> {profile.address.split(",").slice(-2).join(",").trim()}
              </span>
              <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-2 hover:text-white">
                <Phone size={14} className="text-gold-500" /> {profile.phone}
              </a>
            </div>
          </div>

          {/* Portrait — real photo when set, branded placeholder otherwise. */}
          <div className="animate-rise mx-auto w-full max-w-sm">
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl border border-gold-500/40" aria-hidden />
              {profile.photoUrl ? (
                // Plain <img>: the URL is admin-entered and can point anywhere,
                // which next/image would reject without per-domain config.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  className="relative aspect-[4/5] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600">
                  <span className="font-display text-7xl font-bold text-gold-400">
                    {initials}
                  </span>
                  <span className="mt-3 text-xs tracking-[0.3em] text-slate-300 uppercase">
                    Portrait
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats band */}
        <div className="border-t border-navy-800 bg-navy-900/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-8 sm:px-6 md:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-2 text-center">
                <div className="font-display text-3xl font-bold text-gold-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs tracking-wider text-slate-400 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / credentials / philosophy ──────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy-900">
              About the practice
            </h2>
            <div className="maple-rule mt-4" />
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600 whitespace-pre-line">
              {profile.bio}
            </div>

            <blockquote className="mt-8 rounded-xl border-l-4 border-gold-500 bg-gold-50 p-6">
              <p className="font-display text-lg italic leading-relaxed text-navy-800">
                “{profile.philosophy}”
              </p>
              <footer className="mt-3 text-sm font-semibold text-slate-500">
                — {profile.name}
              </footer>
            </blockquote>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-navy-900">
              Credentials
            </h2>
            <div className="maple-rule mt-4" />
            <ul className="mt-6 space-y-4">
              {profile.credentials.map((credential) => (
                <li
                  key={credential}
                  className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-4 shadow-sm"
                >
                  <Award size={18} className="mt-0.5 shrink-0 text-gold-600" />
                  <span className="text-sm leading-relaxed text-slate-700">
                    {credential}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl bg-navy-50 p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Areas of practice
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-slate-700 sm:grid-cols-2">
                {[
                  "Express Entry & PNP",
                  "Study & work permits",
                  "Family sponsorship",
                  "Citizenship",
                  "Refusals & judicial review",
                  "Business immigration",
                ].map((area) => (
                  <li key={area} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="shrink-0 text-gold-600" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured stories ──────────────────────────────────────── */}
      {stories.length > 0 && (
        <section className="bg-navy-50/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-navy-900">
                  Recent client results
                </h2>
                <div className="maple-rule mt-4" />
              </div>
              <Link
                href="/success-stories"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-navy-600"
              >
                All success stories <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest news ───────────────────────────────────────────── */}
      {news.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-navy-900">
                Immigration news & updates
              </h2>
              <div className="maple-rule mt-4" />
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-navy-600"
            >
              All articles <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display max-w-2xl text-3xl font-bold text-white">
            Ready for an honest assessment of your Canadian options?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            One consultation. A written pathway. No pressure to retain.
          </p>
          <Link href="/consultation" className="btn-gold">
            <CalendarCheck size={17} /> Book your consultation
          </Link>
        </div>
      </section>
    </>
  );
}
