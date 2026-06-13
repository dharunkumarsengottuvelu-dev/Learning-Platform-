"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTest(testId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const duration = parseInt(formData.get("duration") as string);
  const totalMarks = parseInt(formData.get("totalMarks") as string);
  const passingMarks = parseInt(formData.get("passingMarks") as string);

  await db.test.update({
    where: { id: testId },
    data: {
      title,
      description,
      type,
      status,
      duration,
      totalMarks,
      passingMarks
    }
  });

  revalidatePath(`/admin/tests/${testId}`);
  revalidatePath(`/admin/tests`);
  redirect(`/admin/tests/${testId}`);
}
