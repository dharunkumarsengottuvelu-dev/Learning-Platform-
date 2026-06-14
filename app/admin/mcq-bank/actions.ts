"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMCQ(formData: FormData) {
  const title = formData.get("title") as string;
  const marks = parseInt(formData.get("marks") as string) || 1;
  const type = formData.get("type") as string || "SINGLE_CHOICE";
  const optionsRaw = formData.get("options") as string;
  const correctAnswerRaw = formData.get("correctAnswer") as string;
  const explanation = formData.get("explanation") as string;
  
  let options = "[]";
  let correctAnswer = "[]";
  
  try {
    if (optionsRaw) options = optionsRaw;
    if (correctAnswerRaw) correctAnswer = correctAnswerRaw;
  } catch (e) {
    console.error("Failed to parse options/answers", e);
  }

  await db.question.create({
    data: {
      title,
      marks,
      type,
      options,
      correctAnswer,
      explanation,
    }
  });

  revalidatePath("/admin/mcq-bank");
  redirect("/admin/mcq-bank");
}

export async function updateMCQ(questionId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const marks = parseInt(formData.get("marks") as string) || 1;
  const type = formData.get("type") as string || "SINGLE_CHOICE";
  const optionsRaw = formData.get("options") as string;
  const correctAnswerRaw = formData.get("correctAnswer") as string;
  const explanation = formData.get("explanation") as string;
  
  let options = "[]";
  let correctAnswer = "[]";
  
  try {
    if (optionsRaw) options = optionsRaw;
    if (correctAnswerRaw) correctAnswer = correctAnswerRaw;
  } catch (e) {
    console.error("Failed to parse options/answers", e);
  }

  await db.question.update({
    where: { id: questionId },
    data: {
      title,
      marks,
      type,
      options,
      correctAnswer,
      explanation,
    }
  });

  revalidatePath(`/admin/mcq-bank/${questionId}`);
  revalidatePath("/admin/mcq-bank");
  redirect("/admin/mcq-bank");
}

export async function deleteMCQ(questionId: string) {
  await db.question.delete({
    where: { id: questionId }
  });
  
  revalidatePath("/admin/mcq-bank");
}
