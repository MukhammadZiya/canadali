"use client";

/**
 * The booking inquiry form. Submits through a server action; on success the
 * form is replaced by a confirmation card, which is both friendlier than a
 * toast and impossible to miss.
 */
import { useActionState } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { submitInquiry, type InquiryState } from "@/actions/inquiry";

const SERVICES = [
  "Initial Consultation",
  "Strategy Session",
  "File Review",
  "Not sure yet",
];

export default function InquiryForm() {
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    {}
  );

  if (state.ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-600" />
        <h3 className="font-display mt-4 text-xl font-bold text-navy-900">
          Request received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Thank you — your consultation request is in. The office will reply
          within one business day with available times and the intake form.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="field-label">Full name *</label>
          <input id="inq-name" name="name" required maxLength={120}
            className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="inq-email" className="field-label">Email *</label>
          <input id="inq-email" name="email" type="email" required maxLength={160}
            className="field" placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-phone" className="field-label">Phone / WhatsApp</label>
          <input id="inq-phone" name="phone" maxLength={40}
            className="field" placeholder="+1 …" />
        </div>
        <div>
          <label htmlFor="inq-service" className="field-label">Consultation type</label>
          <select id="inq-service" name="service" className="field" defaultValue={SERVICES[0]}>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="inq-message" className="field-label">
          Your situation *
        </label>
        <textarea id="inq-message" name="message" required rows={5} maxLength={4000}
          className="field"
          placeholder="A few sentences: your goal (study, work, PR…), where you are now, and any deadlines or previous refusals." />
      </div>

      {/* Honeypot — hidden from people, attractive to bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off"
        className="hidden" aria-hidden="true" />

      {state.error && (
        <p className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <TriangleAlert size={16} /> {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-navy w-full sm:w-auto">
        {pending ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          <><Send size={16} /> Request a consultation</>
        )}
      </button>

      <p className="text-xs leading-relaxed text-slate-400">
        Submitting this form does not create a solicitor–client relationship.
        Please do not include confidential details beyond what is needed to
        schedule your consultation.
      </p>
    </form>
  );
}
