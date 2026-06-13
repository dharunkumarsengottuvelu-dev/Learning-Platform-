import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const testId = searchParams.get("testId") || undefined;
  const difficulty = searchParams.get("difficulty") || undefined;

  const problems = await db.codingProblem.findMany({
    where: {
      ...(testId ? { testId } : {}),
      ...(difficulty ? { difficulty: difficulty as any } : {}),
    },
    include: { _count: { select: { testCases: true, submissions: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(problems);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, description, difficulty, constraints, inputFormat, outputFormat, sampleInput, sampleOutput, marks, timeLimit, memoryLimit, enabledLanguages, testId, testCases } = body;

  if (!title || !description) return NextResponse.json({ message: "Title and description are required." }, { status: 400 });

  const problem = await db.codingProblem.create({
    data: {
      title, description, difficulty: difficulty || "EASY", constraints,
      inputFormat, outputFormat, sampleInput, sampleOutput,
      marks: parseInt(marks || 10),
      timeLimit: parseInt(timeLimit || 2),
      memoryLimit: parseInt(memoryLimit || 256),
      enabledLanguages: enabledLanguages || ["python", "javascript", "java", "cpp", "c"],
      testId: testId || null,
    },
  });

  // Add test cases if provided
  if (testCases?.length) {
    await db.testCase.createMany({
      data: testCases.map((tc: any, i: number) => ({
        problemId: problem.id,
        input: tc.input,
        output: tc.output,
        isHidden: tc.isHidden || false,
        order: i,
      })),
    });
  }

  return NextResponse.json(problem, { status: 201 });
}
