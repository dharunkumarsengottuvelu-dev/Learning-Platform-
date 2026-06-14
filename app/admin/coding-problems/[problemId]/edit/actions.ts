"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCodingProblem(problemId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const marks = parseInt(formData.get("marks") as string);

  const testCasesStr = formData.get("testCases") as string | null;

  let testCases = [];
  if (testCasesStr) {
    try {
      testCases = JSON.parse(testCasesStr);
    } catch (e) {
      console.error("Failed to parse test cases", e);
    }
  }

  await db.codingProblem.update({
    where: { id: problemId },
    data: {
      title,
      description,
      difficulty,
      marks,
      testCases: {
        deleteMany: {},
        create: testCases.map((tc: any, index: number) => ({
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden,
          order: index
        }))
      }
    }
  });

  revalidatePath(`/admin/coding-problems/${problemId}`);
  revalidatePath(`/admin/coding-problems`);
  redirect(`/admin/coding-problems/${problemId}`);
}
