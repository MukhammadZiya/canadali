"use client";

/** Submit button with a built-in pending state — shared by every editor. */
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";

export default function SubmitButton({
  label = "Save changes",
}: {
  label?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-navy disabled:opacity-60">
      {pending ? (
        <><Loader2 size={15} className="animate-spin" /> Saving…</>
      ) : (
        <><Save size={15} /> {label}</>
      )}
    </button>
  );
}
