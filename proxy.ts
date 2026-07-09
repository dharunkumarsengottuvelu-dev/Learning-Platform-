import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  // Determine if the request is coming over HTTPS (Vercel/Render) or HTTP (local dev).
  // NextAuth v5 uses "__Secure-authjs.session-token" on HTTPS and
  // "authjs.session-token" on HTTP. The secureCookie flag selects the right name.
  const isSecure =
    req.headers.get("x-forwarded-proto") === "https" ||
    nextUrl.protocol === "https:";

  // getToken decodes the JWT and returns the payload — including our custom
  // fields (role, id, photo) that we set in the jwt() callback in auth.ts.
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  });

  const isLoggedIn = !!token;
  // token is the decoded JWT payload — role is available directly
  const role = token?.role as string | undefined;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  const isAdminPage = nextUrl.pathname.startsWith("/admin");
  const isStudentPage = nextUrl.pathname.startsWith("/student");

  // Allow ALL /api/* routes to pass through — each API route handles its own auth.
  // DO NOT redirect API requests to /login — that breaks fetch() calls from client.
  if (nextUrl.pathname.startsWith("/api")) return NextResponse.next();

  // Not logged in → redirect to login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Logged in but on auth page → redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
  }

  // Admin routes: only ADMIN or SUPER_ADMIN
  if (isAdminPage && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
  }

  // Student routes: only STUDENT role
  if (isStudentPage && (role === "ADMIN" || role === "SUPER_ADMIN")) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|icon.svg).*)",
  ],
};

