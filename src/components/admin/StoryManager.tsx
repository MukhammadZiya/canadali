"use client";

/**
 * Success-stories CRUD. One editor panel at the top (blank = creating,
 * filled = editing), with the list below. The `key` on the form is the
 * selected id, which is what resets defaultValues when a different story is
 * chosen — simpler and less error-prone than syncing controlled state.
 */
import { useState } from "react";
import { useActionState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteStory, saveStory, type ActionState } from "@/actions/content";
import Flash from "@/components/admin/Flash";
import SubmitButton from "@/components/admin/SubmitButton";
import type { Story } from "@/lib/types";

export default function StoryManager({ stories }: { stories: Story[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveStory,
    {}
  );

  const editing = stories.find((s) => s.id === editingId) ?? null;

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
            {editing ? `Editing: ${editing.name}` : "Add a success story"}
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

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="st-name">
              Client name — first name + initial only *
            </label>
            <input id="st-name" name="name" required className="field"
              defaultValue={editing?.name} placeholder="Rustam A." />
          </div>
          <div>
            <label className="field-label" htmlFor="st-visa">Visa type *</label>
            <input id="st-visa" name="visaType" required className="field"
              defaultValue={editing?.visaType} placeholder="Express Entry — PR" />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="st-country">Country of origin</label>
            <input id="st-country" name="country" className="field"
              defaultValue={editing?.country} placeholder="Uzbekistan" />
          </div>
          <div>
            <label className="field-label" htmlFor="st-year">Year</label>
            <input id="st-year" name="year" className="field"
              defaultValue={editing?.year} placeholder="2026" />
          </div>
        </div>

        <div className="mt-5">
          <label className="field-label" htmlFor="st-summary">
            Case summary — what the problem was and how it was won
          </label>
          <textarea id="st-summary" name="summary" rows={3} className="field"
            defaultValue={editing?.summary} />
        </div>

        <div className="mt-5">
          <label className="field-label" htmlFor="st-quote">Client testimonial quote</label>
          <textarea id="st-quote" name="quote" rows={2} className="field"
            defaultValue={editing?.quote} />
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm text-slate-700">
          <input type="checkbox" name="published"
            defaultChecked={editing ? editing.published : true}
            className="h-4 w-4 rounded border-slate-300 accent-[#10294d]" />
          Published — visible on the public site
        </label>

        <div className="mt-6 flex items-center gap-4">
          <SubmitButton label={editing ? "Save story" : "Add story"} />
          <Flash state={state} />
        </div>
      </form>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-bold text-navy-900">
            All stories ({stories.length})
          </h2>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-600"
          >
            <Plus size={14} /> New story
          </button>
        </div>
        {stories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">
            No stories yet — add the first one above.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {stories.map((story) => (
              <li key={story.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {story.name}
                    </span>
                    <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                      {story.visaType}
                    </span>
                    {!story.published && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {story.country} · {story.year} — {story.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingId(story.id)}
                  className="rounded-md p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-700"
                  aria-label={`Edit ${story.name}`}
                >
                  <Pencil size={16} />
                </button>
                <form
                  action={deleteStory}
                  onSubmit={(e) => {
                    if (!confirm(`Delete the story for ${story.name}? This cannot be undone.`)) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={story.id} />
                  <button
                    type="submit"
                    className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${story.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
