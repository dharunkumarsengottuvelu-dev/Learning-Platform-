import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import CourseClient from "./CourseClient";

export default async function CourseViewerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const studentId = session.user?.id!;
  const { courseId } = await params;

  const enrollment = await db.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });

  if (!enrollment) {
    notFound(); // Not enrolled, throw 404
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) {
    notFound();
  }

  return <CourseClient course={course} enrollment={enrollment} />;
}
