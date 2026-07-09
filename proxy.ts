import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  const isAdminPage = nextUrl.pathname.startsWith("/admin");
  const isStudentPage = nextUrl.pathname.startsWith("/student");

  // Allow ALL /api/* routes to pass through
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
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|icon.svg).*)",
  ],
};

