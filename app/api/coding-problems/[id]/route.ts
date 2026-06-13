import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = await db.codingProblem.findUnique({
    where: { id },
    include: { testCases: { orderBy: { order: "asc" } } },
  });
  if (!problem) return NextResponse.json({ message: "Problem not found." }, { status: 404 });

  // For students, hide hidden test case inputs/outputs
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role === "STUDENT") {
    problem.testCases = problem.testCases.map((tc) =>
      tc.isHidden ? { ...tc, input: "Hidden", output: "Hidden" } : tc
    ) as any;
  }

  return NextResponse.json(problem);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const problem = await db.codingProblem.update({ where: { id }, data: body });
  return NextResponse.json(problem);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.codingProblem.delete({ where: { id } });
  return NextResponse.json({ message: "Problem deleted." });
}
