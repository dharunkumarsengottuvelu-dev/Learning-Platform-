import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;

  const where: any = {};
  if (search) where.title = { contains: search, mode: "insensitive" };
  if (status) where.status = status;

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      include: {
        creator: { select: { name: true } },
        _count: { select: { enrollments: true, lessons: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.course.count({ where }),
  ]);

  return NextResponse.json({ courses, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { title, description, thumbnail, duration, difficulty, status } = body;
    if (!title) return NextResponse.json({ message: "Title is required." }, { status: 400 });

    const course = await db.course.create({
      data: { title, description, thumbnail, duration, difficulty: difficulty || "EASY", status: status || "DRAFT", createdBy: session.user!.id! },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSES/POST]", error);
    return NextResponse.json({ message: "Failed to create course." }, { status: 500 });
  }
}
