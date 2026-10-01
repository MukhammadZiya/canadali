/**
 * Consultation inquiries from the public form. Server component — the only
 * interactions are plain form posts to server actions (status change,
 * delete), so no client JS is needed here at all.
 */
import { Mail, Phone, Trash2 } from "lucide-react";
import { deleteInquiry, setInquiryStatus } from "@/actions/content";
import { formatDateTime } from "@/lib/format";
import { readDb } from "@/lib/db";
import type { InquiryStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: "bg-gold-100 text-gold-600",
  contacted: "bg-navy-50 text-navy-700",
  closed: "bg-slate-100 text-slate-500",
};

export default function AdminInquiriesPage() {
  const inquiries = readDb().inquiries;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">
        Inquiries
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Everything submitted through the consultation form, newest first.
      </p>

      {inquiries.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          No inquiries yet. When a visitor submits the consultation form,
          it appears here instantly.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {inquiry.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[inquiry.status]}`}
                    >
                      {inquiry.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                      {inquiry.service}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                    <a href={`mailto:${inquiry.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-navy-700">
                      <Mail size={12} /> {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a href={`tel:${inquiry.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-navy-700">
                        <Phone size={12} /> {inquiry.phone}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDateTime(inquiry.date)}
                </span>
              </div>

              <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {inquiry.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {STATUSES.map((status) => (
                  <form key={status.value} action={setInquiryStatus}>
                    <input type="hidden" name="id" value={inquiry.id} />
                    <input type="hidden" name="status" value={status.value} />
                    <button
                      type="submit"
                      disabled={inquiry.status === status.value}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        inquiry.status === status.value
                          ? "bg-navy-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  </form>
                ))}
                <form action={deleteInquiry} className="ml-auto">
                  <input type="hidden" name="id" value={inquiry.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
