"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCodingProblem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const marks = parseInt(formData.get("marks") as string);
  const testId = formData.get("testId") as string | null;
  const testCasesStr = formData.get("testCases") as string | null;

  let testCases = [];
  if (testCasesStr) {
    try {
      testCases = JSON.parse(testCasesStr);
    } catch (e) {
      console.error("Failed to parse test cases", e);
    }
  }

  const problem = await db.codingProblem.create({
    data: {
      title,
      description,
      difficulty,
      marks,
      enabledLanguages: JSON.stringify(["javascript", "python", "cpp", "java", "go", "rust"]),
      testId: testId || null,
      testCases: {
        create: testCases.map((tc: any, index: number) => ({
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden,
          order: index
        }))
      }
    },
  });

  revalidatePath("/admin/coding-problems");
  redirect("/admin/coding-problems");
}
