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
  const topicId = formData.get("topicId") as string;

  await db.question.create({
    data: {
      title,
      marks,
      type,
      options: optionsRaw || "[]",
      correctAnswer: correctAnswerRaw || "[]",
      explanation,
      mcqTopicId: topicId || null,
    },
  });

  const redirectPath = topicId ? `/admin/mcq-bank/${topicId}` : "/admin/mcq-bank";
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function updateMCQ(questionId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const marks = parseInt(formData.get("marks") as string) || 1;
  const type = formData.get("type") as string || "SINGLE_CHOICE";
  const optionsRaw = formData.get("options") as string;
  const correctAnswerRaw = formData.get("correctAnswer") as string;
  const explanation = formData.get("explanation") as string;
  const topicId = formData.get("topicId") as string;

  await db.question.update({
    where: { id: questionId },
    data: {
      title,
      marks,
      type,
      options: optionsRaw || "[]",
      correctAnswer: correctAnswerRaw || "[]",
      explanation,
      mcqTopicId: topicId || null,
    },
  });

  const redirectPath = topicId ? `/admin/mcq-bank/${topicId}` : "/admin/mcq-bank";
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function deleteMCQ(questionId: string) {
  await db.question.delete({ where: { id: questionId } });
  revalidatePath("/admin/mcq-bank");
}
