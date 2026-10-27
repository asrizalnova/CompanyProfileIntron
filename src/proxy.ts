
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "@/lib/session-token";

/**
 * Pemeriksaan awal untuk URL /admin.
 * Sesi diperpanjang setiap kali ada request admin yang valid.
 * Keamanan tetap diperiksa oleh requireAdmin() di sisi server.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  const isLogin = pathname === "/admin/login";

  if (!session && !isLogin) {
    const url = new URL("/admin/login", request.url);
    return NextResponse.redirect(url);
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();

  if (session) {
    const renewedToken = await signSession(session);
    const secure = (
      process.env.NEXT_PUBLIC_SITE_URL ?? ""
    ).startsWith("https://");

    response.cookies.set(SESSION_COOKIE, renewedToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
