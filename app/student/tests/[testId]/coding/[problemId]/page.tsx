import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";

export default async function CodingProblemPage({
  params,
}: {
  params: Promise<{ testId: string; problemId: string }>;
}) {
  const { testId, problemId } = await params;

  const problem = await db.codingProblem.findUnique({
    where: { id: problemId },
    include: {
      testCases: {
        orderBy: { order: "asc" },
        select: { id: true, input: true, output: true, isHidden: true },
      },
    },
  });

  if (!problem) notFound();

  // Map hidden test cases — students see placeholders only
  const studentProblem = {
    ...problem,
    testCases: problem.testCases.map((tc) =>
      tc.isHidden
        ? { ...tc, input: "[Hidden]", output: "[Hidden]" }
        : tc
    ),
  };

  // IMPORTANT: Next.js strict serialization sometimes fails on Prisma objects or Dates
  // passed to Client Components. Convert to a plain JS object to prevent 500 errors.
  const safeProblem = JSON.parse(JSON.stringify(studentProblem));

  return <CodeEditor problem={safeProblem} />;
}
