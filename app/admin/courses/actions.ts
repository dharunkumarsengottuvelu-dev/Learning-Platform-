"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string) {
  try {
    // Delete related records to prevent foreign key constraint errors
    await db.$transaction([
      db.enrollment.deleteMany({ where: { courseId } }),
      db.certificate.deleteMany({ where: { courseId } }),
      db.batch.updateMany({
        where: { courseId },
        data: { courseId: null },
      }),
      // For tests, we'll just set courseId to null instead of deleting them entirely, 
      // as tests could potentially be reused or exist independently
      db.test.updateMany({
        where: { courseId },
        data: { courseId: null },
      }),
      // Lessons are set to Cascade delete in schema, but we can do it explicitly just in case
      db.lesson.deleteMany({ where: { courseId } }),
      db.course.delete({ where: { id: courseId } }),
    ]);

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return { success: false, error: error.message };
  }
}
