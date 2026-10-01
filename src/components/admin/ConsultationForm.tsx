"use client";

/** Edits the consultation page: intro, three packages, availability note. */
import { useActionState } from "react";
import { saveConsultation, type ActionState } from "@/actions/content";
import Flash from "@/components/admin/Flash";
import SubmitButton from "@/components/admin/SubmitButton";
import type { Consultation } from "@/lib/types";

export default function ConsultationForm({
  consultation,
}: {
  consultation: Consultation;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveConsultation,
    {}
  );

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900">Page introduction</h2>
        <div className="mt-4">
          <textarea name="intro" rows={3} className="field"
            defaultValue={consultation.intro} />
        </div>
        <div className="mt-5">
          <label className="field-label" htmlFor="cn-avail">
            Availability note — shown under the packages
          </label>
          <textarea id="cn-avail" name="availabilityNote" rows={2} className="field"
            defaultValue={consultation.availabilityNote} />
        </div>
      </section>

      {consultation.packages.map((pkg, index) => (
        <section
          key={pkg.id}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-navy-900">
            Package {index + 1}
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <div>
              <label className="field-label">Name</label>
              <input name={`pk-${index}-name`} className="field"
                defaultValue={pkg.name} />
            </div>
            <div>
              <label className="field-label">Price</label>
              <input name={`pk-${index}-price`} className="field"
                defaultValue={pkg.price} placeholder="$250 CAD" />
            </div>
            <div>
              <label className="field-label">Duration / format</label>
              <input name={`pk-${index}-duration`} className="field"
                defaultValue={pkg.duration} />
            </div>
          </div>
          <div className="mt-5">
            <label className="field-label">Description</label>
            <textarea name={`pk-${index}-description`} rows={2} className="field"
              defaultValue={pkg.description} />
          </div>
          <div className="mt-5">
            <label className="field-label">What&rsquo;s included — one per line</label>
            <textarea name={`pk-${index}-features`} rows={4} className="field"
              defaultValue={pkg.features.join("\n")} />
          </div>
          <label className="mt-4 flex items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" name={`pk-${index}-highlighted`}
              defaultChecked={pkg.highlighted}
              className="h-4 w-4 rounded border-slate-300 accent-[#10294d]" />
            Highlight as &ldquo;Most chosen&rdquo;
          </label>
        </section>
      ))}

      <div className="flex items-center gap-4">
        <SubmitButton />
        <Flash state={state} />
      </div>
    </form>
  );
}
