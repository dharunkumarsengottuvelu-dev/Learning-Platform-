import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  const cookies = request.headers.get("cookie") || "";
  
  return NextResponse.json({
    session: session,
    cookies: cookies,
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET (length: " + process.env.AUTH_SECRET.length + ")" : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT SET"
    }
  });
}
