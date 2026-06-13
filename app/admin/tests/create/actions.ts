"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTest(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const duration = parseInt(formData.get("duration") as string);
  const passingMarks = parseInt(formData.get("passingMarks") as string);
  const totalMarks = parseInt(formData.get("totalMarks") as string);

  const test = await db.test.create({
    data: {
      title,
      description,
      type,
      duration,
      passingMarks,
      totalMarks,
      status: "DRAFT",
      createdBy: session.user.id,
    },
  });

  revalidatePath("/admin/tests");
  redirect("/admin/tests");
}
