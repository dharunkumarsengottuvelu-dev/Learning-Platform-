"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTest(testId: string) {
  await db.test.delete({
    where: { id: testId }
  });
  
  revalidatePath("/admin/tests");
}
