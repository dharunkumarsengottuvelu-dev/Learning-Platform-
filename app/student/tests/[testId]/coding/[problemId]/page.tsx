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

  return <CodeEditor problem={studentProblem as any} />;
}
