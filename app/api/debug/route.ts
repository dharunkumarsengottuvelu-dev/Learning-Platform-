import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  
  return NextResponse.json({
    message: "Debug route without auth()",
    cookies: cookies,
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET (length: " + process.env.AUTH_SECRET.length + ")" : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT SET"
    }
  });
}
