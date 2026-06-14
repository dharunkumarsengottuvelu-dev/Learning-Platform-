"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTestCase(problemId: string, formData: FormData) {
  const input = formData.get("input") as string;
  const output = formData.get("output") as string;
  const isHiddenStr = formData.get("isHidden") as string;
  
  const isHidden = isHiddenStr === "on" || isHiddenStr === "true";

  if (!input || !output) {
    throw new Error("Input and output are required.");
  }

  // Get the highest order to append at the end
  const existingCases = await db.testCase.findMany({
    where: { problemId },
    orderBy: { order: "desc" },
    take: 1,
  });
  
  const order = existingCases.length > 0 ? existingCases[0].order + 1 : 0;

  await db.testCase.create({
    data: {
      problemId,
      input,
      output,
      isHidden,
      order,
    }
  });

  revalidatePath(`/admin/coding-problems/${problemId}/test-cases`);
  revalidatePath(`/admin/coding-problems/${problemId}`);
}

export async function deleteTestCase(problemId: string, testCaseId: string) {
  await db.testCase.delete({
    where: { id: testCaseId }
  });
  
  revalidatePath(`/admin/coding-problems/${problemId}/test-cases`);
  revalidatePath(`/admin/coding-problems/${problemId}`);
}

export async function updateTestCase(problemId: string, testCaseId: string, formData: FormData) {
  const input = formData.get("input") as string;
  const output = formData.get("output") as string;
  const isHiddenStr = formData.get("isHidden") as string;
  
  const isHidden = isHiddenStr === "on" || isHiddenStr === "true";

  if (!input || !output) {
    throw new Error("Input and output are required.");
  }

  await db.testCase.update({
    where: { id: testCaseId },
    data: {
      input,
      output,
      isHidden,
    }
  });

  revalidatePath(`/admin/coding-problems/${problemId}/test-cases`);
  revalidatePath(`/admin/coding-problems/${problemId}`);
}
