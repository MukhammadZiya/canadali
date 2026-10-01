/**
 * Guards every /admin page behind the session cookie.
 *
 * The check lives here, in the proxy (Next 16's name for middleware), rather
 * than in the admin layout: layouts do not re-run on client-side navigation,
 * so a layout-only check can be sidestepped. The proxy runs on every
 * request, so hiding the menu and refusing the URL can never disagree.
 */
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable, or nobody could ever sign in.
  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (cookie && cookie === (await sessionToken())) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
