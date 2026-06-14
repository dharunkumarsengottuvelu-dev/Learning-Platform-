"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCodingProblem(problemId: string) {
  // Delete related submissions first to prevent foreign key constraint errors
  await db.submission.deleteMany({
    where: { problemId }
  });

  // Delete related test cases (though Cascade is set in DB, doing it here is safer)
  await db.testCase.deleteMany({
    where: { problemId }
  });

  // Finally delete the coding problem itself
  await db.codingProblem.delete({
    where: { id: problemId }
  });
  
  revalidatePath("/admin/coding-problems");
}
