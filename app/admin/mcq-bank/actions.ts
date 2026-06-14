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
      mcqTopicId: topicId || null,
    }
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
      mcqTopicId: topicId || null,
    }
  });

  const redirectPath = topicId ? `/admin/mcq-bank/${topicId}` : "/admin/mcq-bank";
  revalidatePath(`/admin/mcq-bank/${questionId}/edit`);
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function deleteMCQ(questionId: string) {
  await db.question.delete({
    where: { id: questionId }
  });
  
  // We don't know the exact topic page, so revalidate all
  revalidatePath("/admin/mcq-bank");
}

export async function createTopic(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const topic = await db.mCQTopic.create({
    data: {
      name,
      description,
    }
  });

  revalidatePath("/admin/mcq-bank");
  redirect(`/admin/mcq-bank/${topic.id}`);
}

export async function deleteTopic(topicId: string) {
  await db.mCQTopic.delete({
    where: { id: topicId }
  });
  
  revalidatePath("/admin/mcq-bank");
}
