import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true, email: true } },
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) return NextResponse.json({ message: "Course not found." }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const course = await db.course.update({ where: { id }, data: body });
  return NextResponse.json(course);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.course.delete({ where: { id } });
  return NextResponse.json({ message: "Course deleted." });
}
