import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET all tests
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;
  const type = searchParams.get("type") || undefined;

  const tests = await db.test.findMany({
    where: { ...(courseId ? { courseId } : {}), ...(type ? { type: type as any } : {}) },
    include: {
      creator: { select: { name: true } },
      _count: { select: { questions: true, codingProblems: true, testAssignments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tests);
}

// POST create test
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, description, type, duration, startDate, endDate, passingMarks, totalMarks, courseId, status } = body;

  if (!title || !duration) return NextResponse.json({ message: "Title and duration are required." }, { status: 400 });

  const test = await db.test.create({
    data: {
      title, description, type: type || "CODING", duration: parseInt(duration),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      passingMarks: parseInt(passingMarks || 40),
      totalMarks: parseInt(totalMarks || 100),
      courseId: courseId || null,
      status: status || "DRAFT",
      createdBy: session.user!.id!,
    },
  });
  return NextResponse.json(test, { status: 201 });
}
