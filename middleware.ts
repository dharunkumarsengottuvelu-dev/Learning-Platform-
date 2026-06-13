import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const role = (session?.user as any)?.role;

  const isAuthPage = nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  const isAdminPage = nextUrl.pathname.startsWith("/admin");
  const isStudentPage = nextUrl.pathname.startsWith("/student");
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) return NextResponse.next();

  // Not logged in — redirect to login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Logged in but on auth page — redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
  }

  // Admin routes — only ADMIN or SUPER_ADMIN
  if (isAdminPage && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
  }

  // Student routes — only STUDENT
  if (isStudentPage && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
