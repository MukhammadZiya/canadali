"use client";

/** News CRUD — same editor-above-list pattern as the stories manager. */
import { useState } from "react";
import { useActionState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteArticle, saveArticle, type ActionState } from "@/actions/content";
import Flash from "@/components/admin/Flash";
import SubmitButton from "@/components/admin/SubmitButton";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

const CATEGORIES = [
  "Express Entry",
  "Study Permits",
  "Work Permits",
  "Family Sponsorship",
  "Citizenship",
  "IRCC Updates",
];

export default function NewsManager({ articles }: { articles: Article[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveArticle,
    {}
  );

  const editing = articles.find((a) => a.id === editingId) ?? null;

  return (
    <div className="space-y-6">
      {/* Editor */}
      <form
        key={editingId ?? "new"}
        action={formAction}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900">
            {editing ? "Editing article" : "Write a new article"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel — create new instead
            </button>
          )}
        </div>

        <input type="hidden" name="id" value={editing?.id ?? ""} />

        <div className="mt-4">
          <label className="field-label" htmlFor="nw-title">Title *</label>
          <input id="nw-title" name="title" required className="field"
            defaultValue={editing?.title} />
          {editing && (
            <p className="mt-1 text-xs text-slate-400">
              Public URL stays <code>/news/{editing.slug}</code> — links
              already shared keep working even if you change the title.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="nw-category">Category</label>
            <select id="nw-category" name="category" className="field"
              defaultValue={editing?.category ?? CATEGORIES[0]}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="nw-date">Publish date</label>
            <input id="nw-date" name="date" type="date" className="field"
              defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} />
          </div>
        </div>

        <div className="mt-5">
          <label className="field-label" htmlFor="nw-excerpt">
            Excerpt — one or two sentences for cards and search results
          </label>
          <textarea id="nw-excerpt" name="excerpt" rows={2} className="field"
            defaultValue={editing?.excerpt} />
        </div>

        <div className="mt-5">
          <label className="field-label" htmlFor="nw-content">
            Article content * — blank line between paragraphs
          </label>
          <textarea id="nw-content" name="content" required rows={10} className="field"
            defaultValue={editing?.content} />
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm text-slate-700">
          <input type="checkbox" name="published"
            defaultChecked={editing ? editing.published : true}
            className="h-4 w-4 rounded border-slate-300 accent-[#10294d]" />
          Published — visible on the public site
        </label>

        <div className="mt-6 flex items-center gap-4">
          <SubmitButton label={editing ? "Save article" : "Publish article"} />
          <Flash state={state} />
        </div>
      </form>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-bold text-navy-900">
            All articles ({articles.length})
          </h2>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-600"
          >
            <Plus size={14} /> New article
          </button>
        </div>
        <ul className="divide-y divide-slate-100">
          {articles.map((article) => (
            <li key={article.id} className="flex items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {article.title}
                  </span>
                  {!article.published && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {article.category} · {formatDate(article.date)}
                </p>
              </div>
              <a
                href={`/news/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-700"
                aria-label="Open on the public site"
              >
                <ExternalLink size={16} />
              </a>
              <button
                type="button"
                onClick={() => setEditingId(article.id)}
                className="rounded-md p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-700"
                aria-label={`Edit ${article.title}`}
              >
                <Pencil size={16} />
              </button>
              <form
                action={deleteArticle}
                onSubmit={(e) => {
                  if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={article.id} />
                <button
                  type="submit"
                  className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${article.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
