"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string | null;
  const duration = formData.get("duration") as string | null;
  const difficulty = formData.get("difficulty") as string;

  const course = await db.course.create({
    data: {
      title,
      description,
      thumbnail: thumbnail || null,
      duration: duration || null,
      difficulty,
      createdBy: session.user.id,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/courses");
  redirect(`/admin/courses`);
}
