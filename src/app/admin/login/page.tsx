"use client";

/**
 * Admin sign-in. Full-screen, outside the dashboard shell. The ?next=
 * parameter preserves where the lawyer was heading before the middleware
 * bounced them here.
 */
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, Loader2, Scale, TriangleAlert } from "lucide-react";
import { login, type LoginState } from "@/actions/auth";

function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <form action={formAction} className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-800 text-gold-400">
          <Scale size={26} strokeWidth={1.7} />
        </span>
        <h1 className="font-display mt-5 text-2xl font-bold text-white">
          Carter Immigration Law
        </h1>
        <p className="mt-1 text-xs tracking-[0.3em] text-slate-400 uppercase">
          Content administration
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-7 shadow-xl">
        <label htmlFor="password" className="field-label">
          Administrator password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="field"
          placeholder="••••••••••"
        />
        <input type="hidden" name="next" value={next} />

        {state.error && (
          <p className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <TriangleAlert size={15} /> {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-navy mt-5 w-full">
          {pending ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : (
            <><KeyRound size={16} /> Sign in</>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Default development password: <code className="rounded bg-slate-100 px-1.5 py-0.5">maple2026</code>
          <br />Set <code className="rounded bg-slate-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> in .env.local to change it.
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      {/* useSearchParams requires a Suspense boundary during prerender. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
