import type { Metadata } from "next";
import { CheckCircle2, Clock3, Info } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Transparent consultation pricing, what to expect, and the booking form.",
};

export default function ConsultationPage() {
  const { consultation } = readDb();

  return (
    <>
      <section className="bg-navy-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold">Consultations</h1>
          <div className="maple-rule mt-5" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
            {consultation.intro}
          </p>
        </div>
      </section>

      {/* ── Packages ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {consultation.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-2xl border p-7 shadow-sm ${
                pkg.highlighted
                  ? "border-gold-500 bg-navy-950 text-white shadow-lg"
                  : "border-navy-100 bg-white"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
                  Most chosen
                </span>
              )}
              <h2
                className={`font-display text-xl font-bold ${
                  pkg.highlighted ? "text-white" : "text-navy-900"
                }`}
              >
                {pkg.name}
              </h2>
              <div
                className={`font-display mt-3 text-3xl font-bold ${
                  pkg.highlighted ? "text-gold-400" : "text-navy-800"
                }`}
              >
                {pkg.price}
              </div>
              <p
                className={`mt-1 inline-flex items-center gap-1.5 text-xs ${
                  pkg.highlighted ? "text-slate-300" : "text-slate-400"
                }`}
              >
                <Clock3 size={13} /> {pkg.duration}
              </p>
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  pkg.highlighted ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {pkg.description}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        pkg.highlighted ? "text-gold-400" : "text-gold-600"
                      }`}
                    />
                    <span
                      className={
                        pkg.highlighted ? "text-slate-200" : "text-slate-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`${pkg.highlighted ? "btn-gold" : "btn-navy"} mt-7 w-full`}
              >
                Request this consultation
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
          <Info size={14} className="mt-0.5 shrink-0" />
          {consultation.availabilityNote}
        </p>
      </section>

      {/* ── What to expect ────────────────────────────────────────── */}
      <section className="bg-navy-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy-900">
            What to expect
          </h2>
          <div className="maple-rule mt-4" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {consultation.expectations.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="font-display text-4xl font-bold text-gold-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display mt-3 text-lg font-bold text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking form ──────────────────────────────────────────── */}
      <section id="book" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy-900">
          Request your consultation
        </h2>
        <div className="maple-rule mt-4" />
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Tell the office a little about your situation and you will receive
          available times within one business day.
        </p>
        <div className="mt-8">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
