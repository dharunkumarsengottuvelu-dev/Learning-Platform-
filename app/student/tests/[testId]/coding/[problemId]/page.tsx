import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";

export default async function CodingProblemPage({
  params,
}: {
  params: Promise<{ testId: string; problemId: string }>;
}) {
  // 1. Auth guard
  const session = await auth();
  if (!session) redirect("/login");

  // 2. Resolve and validate params
  let testId: string;
  let problemId: string;
  try {
    const resolved = await params;
    testId = (resolved.testId ?? "").trim();
    problemId = (resolved.problemId ?? "").trim();
  } catch (err) {
    console.error("[CodingProblemPage] Failed to resolve params:", err);
    notFound();
    return; // TypeScript narrowing
  }

  if (!testId || !problemId) {
    notFound();
  }

  // 3. Fetch problem with full error handling
  let problem;
  try {
    problem = await db.codingProblem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          orderBy: { order: "asc" },
          select: { id: true, input: true, output: true, isHidden: true },
        },
      },
    });
  } catch (err: any) {
    // Log full error server-side for debugging; never expose to client
    console.error(
      "[CodingProblemPage] DB error fetching problem:",
      err?.message ?? err
    );
    // Throw so the nearest error.tsx boundary catches this
    throw new Error(
      "Unable to load this problem. Please check your connection and try again."
    );
  }

  // 4. 404 if problem doesn't exist
  if (!problem) {
    notFound();
  }

  // 5. Verify the problem belongs to the requested test (authorization)
  let testExists = false;
  try {
    const test = await db.test.findUnique({
      where: { id: testId },
      select: { id: true, codingProblems: { where: { id: problemId }, select: { id: true } } },
    });
    testExists = !!(test && test.codingProblems.length > 0);
  } catch (err: any) {
    console.error(
      "[CodingProblemPage] DB error verifying test membership:",
      err?.message ?? err
    );
    // Non-fatal — still show the problem if it exists
    testExists = true;
  }

  if (!testExists) {
    notFound();
  }

  // 6. Sanitize enabledLanguages before sending to client — prevents JSON.parse crash
  let safeEnabledLanguages = '["python"]';
  try {
    const parsed = JSON.parse(problem.enabledLanguages || '["python"]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      safeEnabledLanguages = JSON.stringify(parsed);
    }
  } catch {
    console.warn(
      "[CodingProblemPage] enabledLanguages is malformed JSON for problem",
      problemId,
      "— defaulting to python"
    );
    safeEnabledLanguages = '["python"]';
  }

  // 7. Map hidden test cases — students see placeholders only
  const studentProblem = {
    ...problem,
    enabledLanguages: safeEnabledLanguages,
    testCases: problem.testCases.map((tc) =>
      tc.isHidden ? { ...tc, input: "[Hidden]", output: "[Hidden]" } : tc
    ),
  };

  return <CodeEditor problem={studentProblem as any} />;
}
