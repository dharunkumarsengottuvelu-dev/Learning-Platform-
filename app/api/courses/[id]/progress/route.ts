import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id: courseId } = await params;
  const { lessonIndex, totalLessons } = await req.json();

  if (lessonIndex === undefined || !totalLessons) {
    return NextResponse.json({ message: "lessonIndex and totalLessons are required." }, { status: 400 });
  }

  try {
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user!.id!,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ message: "Not enrolled in this course." }, { status: 403 });
    }

    // Progress = how far the student has gotten (index+1 out of total)
    const newProgress = Math.min(100, Math.round(((lessonIndex + 1) / totalLessons) * 100));

    // Only update if the new progress is higher than current
    const updatedProgress = Math.max(enrollment.progress, newProgress);

    const updated = await db.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: session.user!.id!,
          courseId,
        },
      },
      data: {
        progress: updatedProgress,
        ...(updatedProgress === 100 ? { completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ progress: updated.progress });
  } catch (error) {
    console.error("[PROGRESS/POST]", error);
    return NextResponse.json({ message: "Failed to update progress." }, { status: 500 });
  }
}
