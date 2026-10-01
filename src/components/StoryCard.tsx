/** One success story — used on the home page and the stories page. */
import { BadgeCheck, Quote } from "lucide-react";
import type { Story } from "@/lib/types";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800">
          <BadgeCheck size={14} className="text-gold-600" />
          {story.visaType}
        </span>
        <span className="text-xs font-medium text-slate-400">
          {story.country} · {story.year}
        </span>
      </div>

      <h3 className="font-display mt-4 text-lg font-bold text-navy-900">
        {story.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {story.summary}
      </p>

      {story.quote && (
        <blockquote className="mt-5 border-l-2 border-gold-500 pl-4">
          <Quote size={14} className="mb-1 text-gold-500" />
          <p className="text-sm italic leading-relaxed text-slate-500">
            “{story.quote}”
          </p>
        </blockquote>
      )}
    </article>
  );
}
