import { NextRequest, NextResponse } from "next/server";
import { submitCode } from "@/lib/judge0";
import { auth } from "@/lib/auth";

// Allow up to 60 seconds for code execution on Vercel
export const maxDuration = 60;


export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { code, language, stdin } = await req.json();
    if (!code || !language) {
      return NextResponse.json({ message: "Code and language are required." }, { status: 400 });
    }

    const result = await submitCode(code, language, stdin || "");

    return NextResponse.json({
      status: result.status?.description,
      statusId: result.status?.id,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      time: result.time,
      memory: result.memory,
      message: result.message || "",
    });
  } catch (error: any) {
    console.error("[CODE/RUN]", error);
    return NextResponse.json({ message: error.message || "Execution failed." }, { status: 500 });
  }
}
