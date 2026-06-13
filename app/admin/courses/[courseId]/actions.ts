"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addLesson(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const description = formData.get("description") as string;
  
  // Get current max order
  const lastLesson = await db.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });
  
  const newOrder = lastLesson ? lastLesson.order + 1 : 0;

  await db.lesson.create({
    data: {
      courseId,
      title,
      content: description || null,
      videoUrl: videoUrl || null,
      order: newOrder,
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true };
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const description = formData.get("description") as string;

  await db.lesson.update({
    where: { id: lessonId },
    data: {
      title,
      content: description || null,
      videoUrl: videoUrl || null,
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true };
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await db.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true };
}
