"use client";

/** Inline save feedback used under every admin form. */
import { CheckCircle2, TriangleAlert } from "lucide-react";
import type { ActionState } from "@/actions/content";

export default function Flash({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-700">
        <TriangleAlert size={15} /> {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-2.5 text-sm text-green-700">
        <CheckCircle2 size={15} /> Saved — the public site is already updated.
      </p>
    );
  }
  return null;
}
