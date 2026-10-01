import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import StoryCard from "@/components/StoryCard";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real outcomes for real clients: Express Entry, study permits, work permits, sponsorship and permanent residence.",
};

export default function SuccessStoriesPage() {
  const stories = readDb().stories.filter((s) => s.published);

  return (
    <>
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold">Success stories</h1>
          <div className="maple-rule mt-5" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
            A selection of recent files, shared with each client&rsquo;s permission
            and identified by first name only. Every case is different — these
            are not promises, they are examples of careful preparation meeting
            the right strategy.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {stories.length === 0 ? (
          <p className="py-20 text-center text-slate-500">
            Success stories are being updated — please check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-navy-50 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-navy-900">
            Your case could be the next one here
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            Most of these clients came in after a refusal or a bad experience
            elsewhere. The common thread is not luck — it is a file built
            properly the first time it reached an officer&rsquo;s desk.
          </p>
          <Link href="/consultation" className="btn-navy mt-6">
            <CalendarCheck size={17} /> Start with a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
