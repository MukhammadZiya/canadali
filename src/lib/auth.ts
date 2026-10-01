/**
 * Mock authentication for the admin area.
 *
 * One shared password (ADMIN_PASSWORD env, with a dev default) is hashed and
 * stored in an httpOnly cookie; the middleware recomputes the hash and
 * compares on every /admin request. This is intentionally simple — it keeps
 * casual visitors out of the CMS and demonstrates the full login flow — but
 * it is NOT multi-user auth. Before real production use, swap this module
 * for NextAuth or a managed provider; nothing outside this file and
 * middleware.ts needs to change.
 */

export const SESSION_COOKIE = "admin_session";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "maple2026";
}

/** SHA-256 via Web Crypto so the same code runs in Node and the Edge
 *  middleware runtime. */
export async function sessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`${adminPassword()}::carter-admin-v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
