import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Immigration News & Updates",
  description:
    "Plain-language analysis of Canadian immigration changes: Express Entry draws, IRCC policy, study and work permit rules.",
};

export default function NewsIndexPage() {
  const articles = readDb()
    .news.filter((a) => a.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold">
            Immigration news & updates
          </h1>
          <div className="maple-rule mt-5" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
            What changed, what it means, and what to do about it — written for
            applicants, not for other lawyers. Policies summarised here can
            change without notice; always confirm the current rules before
            acting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {articles.length === 0 ? (
          <p className="py-20 text-center text-slate-500">
            No articles published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
