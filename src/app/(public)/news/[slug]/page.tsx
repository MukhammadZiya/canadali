import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/format";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = readDb().news.find((a) => a.slug === slug && a.published);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const article = db.news.find((a) => a.slug === slug && a.published);
  if (!article) notFound();

  const related = db.news
    .filter((a) => a.published && a.id !== article.id)
    .slice(0, 2);

  return (
    <>
      <section className="bg-navy-950 py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={15} /> All news
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-gold-500 px-3 py-1 font-semibold text-navy-950">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <CalendarDays size={13} /> {formatDate(article.date)}
            </span>
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {article.title}
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-display text-lg italic leading-relaxed text-slate-500">
          {article.excerpt}
        </p>
        <div className="maple-rule my-8" />
        <div className="space-y-5 text-[15.5px] leading-relaxed text-slate-700 whitespace-pre-line">
          {article.content}
        </div>

        <div className="mt-12 rounded-xl border border-gold-200 bg-gold-50 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-navy-900">
            How does this affect your case?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Policy summaries are general information, not advice about your
            file. If this change touches your situation, a consultation will
            tell you exactly where you stand.
          </p>
          <Link href="/consultation" className="btn-navy mt-5">
            <CalendarCheck size={16} /> Book a consultation
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-14 border-t border-navy-100 pt-8">
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Also recent
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="font-display text-lg font-bold text-navy-800 hover:text-navy-600"
                  >
                    {item.title}
                  </Link>
                  <span className="ml-3 text-xs text-slate-400">
                    {formatDate(item.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
