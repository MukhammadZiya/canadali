import StoryManager from "@/components/admin/StoryManager";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminStoriesPage() {
  const { stories } = readDb();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">
        Success stories
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Use first names and initials only — never a client&rsquo;s full identity.
        Unpublished stories stay hidden from the public site.
      </p>
      <div className="mt-6">
        <StoryManager stories={stories} />
      </div>
    </div>
  );
}
