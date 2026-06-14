"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createQuestion(testId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const marks = parseInt(formData.get("marks") as string) || 1;
  const type = formData.get("type") as string || "SINGLE_CHOICE";
  
  // Parse options and answers
  const optionsRaw = formData.get("options") as string;
  const correctAnswerRaw = formData.get("correctAnswer") as string;
  
  let options = "[]";
  let correctAnswer = "[]";
  
  try {
    if (optionsRaw) {
      // Assuming options are passed as a comma-separated list or JSON
      // Let's assume the UI sends a JSON string
      options = optionsRaw;
    }
    if (correctAnswerRaw) {
      correctAnswer = correctAnswerRaw;
    }
  } catch (e) {
    console.error("Failed to parse options/answers", e);
  }

  await db.question.create({
    data: {
      testId,
      title,
      marks,
      type,
      options,
      correctAnswer,
    }
  });

  revalidatePath(`/admin/tests/${testId}`);
}

export async function deleteQuestion(testId: string, questionId: string) {
  await db.question.delete({
    where: { id: questionId }
  });
  revalidatePath(`/admin/tests/${testId}`);
}
