/** One article teaser — used on the home page and the news index. */
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-full bg-gold-100 px-3 py-1 font-semibold text-gold-600">
          {article.category}
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <CalendarDays size={13} />
          {formatDate(article.date)}
        </span>
      </div>

      <h3 className="font-display mt-4 text-lg font-bold leading-snug text-navy-900">
        <Link href={`/news/${article.slug}`} className="hover:text-navy-600">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {article.excerpt}
      </p>

      <Link
        href={`/news/${article.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-navy-600"
      >
        Read article <ArrowRight size={15} />
      </Link>
    </article>
  );
}
