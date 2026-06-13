"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCourse(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const status = formData.get("status") as string;

  await db.course.update({
    where: { id: courseId },
    data: {
      title,
      description,
      difficulty,
      status,
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses`);
  redirect(`/admin/courses/${courseId}`);
}
