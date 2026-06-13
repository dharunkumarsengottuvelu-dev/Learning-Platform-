import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// Get students list
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = { role: "STUDENT" };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { college: { contains: search, mode: "insensitive" } },
    ];
  }

  const [students, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, photo: true, phone: true,
        college: true, department: true, year: true, createdAt: true, isActive: true,
        _count: { select: { enrollments: true, submissions: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({ students, total, pages: Math.ceil(total / limit) });
}
