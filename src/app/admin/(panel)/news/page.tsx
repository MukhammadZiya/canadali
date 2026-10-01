import NewsManager from "@/components/admin/NewsManager";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminNewsPage() {
  const articles = [...readDb().news].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">
        News manager
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Immigration news, IRCC updates and tips. Drafts stay private until
        the published box is ticked.
      </p>
      <div className="mt-6">
        <NewsManager articles={articles} />
      </div>
    </div>
  );
}
