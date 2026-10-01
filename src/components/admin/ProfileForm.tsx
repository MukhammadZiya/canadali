"use client";

/** Edits the lawyer's profile — everything the home page and footer show. */
import { useActionState } from "react";
import { saveProfile, type ActionState } from "@/actions/content";
import Flash from "@/components/admin/Flash";
import SubmitButton from "@/components/admin/SubmitButton";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveProfile,
    {}
  );

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900">Identity</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="pf-name">Full name *</label>
            <input id="pf-name" name="name" required defaultValue={profile.name} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="pf-title">Professional title</label>
            <input id="pf-title" name="title" defaultValue={profile.title} className="field" />
          </div>
        </div>
        <div className="mt-5">
          <label className="field-label" htmlFor="pf-photo">
            Photo URL <span className="normal-case font-normal">(leave empty for the branded placeholder)</span>
          </label>
          <input id="pf-photo" name="photoUrl" defaultValue={profile.photoUrl}
            className="field" placeholder="https://…/portrait.jpg" />
        </div>
        <div className="mt-5">
          <label className="field-label" htmlFor="pf-credentials">
            Credentials — one per line
          </label>
          <textarea id="pf-credentials" name="credentials" rows={4} className="field"
            defaultValue={profile.credentials.join("\n")} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900">Bio & philosophy</h2>
        <div className="mt-4">
          <label className="field-label" htmlFor="pf-bio">
            Biography — blank line between paragraphs
          </label>
          <textarea id="pf-bio" name="bio" rows={7} className="field"
            defaultValue={profile.bio} />
        </div>
        <div className="mt-5">
          <label className="field-label" htmlFor="pf-philosophy">
            Philosophy quote
          </label>
          <textarea id="pf-philosophy" name="philosophy" rows={3} className="field"
            defaultValue={profile.philosophy} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900">Contact details</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="pf-phone">Phone</label>
            <input id="pf-phone" name="phone" defaultValue={profile.phone} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="pf-email">Email *</label>
            <input id="pf-email" name="email" type="email" required
              defaultValue={profile.email} className="field" />
          </div>
        </div>
        <div className="mt-5">
          <label className="field-label" htmlFor="pf-address">Office address</label>
          <input id="pf-address" name="address" defaultValue={profile.address} className="field" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900">Social media</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {(
            [
              ["linkedin", "LinkedIn", profile.social.linkedin],
              ["youtube", "YouTube", profile.social.youtube],
              ["twitter", "Twitter / X", profile.social.twitter],
              ["instagram", "Instagram", profile.social.instagram],
            ] as const
          ).map(([name, label, value]) => (
            <div key={name}>
              <label className="field-label" htmlFor={`pf-${name}`}>{label}</label>
              <input id={`pf-${name}`} name={name} defaultValue={value}
                className="field" placeholder="https://…" />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <Flash state={state} />
      </div>
    </form>
  );
}
