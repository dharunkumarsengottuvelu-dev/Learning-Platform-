"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTestAssignment(formData: FormData) {
  const testId = formData.get("testId") as string;
  const assignmentType = formData.get("assignmentType") as string;
  const studentId = formData.get("studentId") as string | null;
  const batchId = formData.get("batchId") as string | null;
  const deadlineStr = formData.get("deadline") as string | null;

  if (!testId || !assignmentType) {
    throw new Error("Missing required fields");
  }

  let deadline: Date | undefined;
  if (deadlineStr) {
    deadline = new Date(deadlineStr);
  }

  if (assignmentType === "STUDENT" && studentId) {
    await db.testAssignment.create({
      data: {
        testId,
        studentId,
        deadline,
      },
    });
  } else if (assignmentType === "BATCH" && batchId) {
    await db.testAssignment.create({
      data: {
        testId,
        batchId,
        deadline,
      },
    });
  } else {
    throw new Error("Invalid assignment target");
  }

  revalidatePath("/admin/assignments");
}

export async function deleteTestAssignment(assignmentId: string) {
  await db.testAssignment.delete({
    where: { id: assignmentId }
  });
  revalidatePath("/admin/assignments");
}
