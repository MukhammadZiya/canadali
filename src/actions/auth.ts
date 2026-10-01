"use server";

/** Login / logout for the admin area. See lib/auth.ts for the model. */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, adminPassword, sessionToken } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (password !== adminPassword()) {
    // One generic message — never confirm how close a guess was.
    return { error: "Incorrect password." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // an office day
  });

  // Only ever redirect inside the admin area — a crafted ?next= must not be
  // able to bounce the lawyer to an external site after login.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
