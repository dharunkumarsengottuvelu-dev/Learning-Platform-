import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runTestCases } from "@/lib/judge0";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { code, language, problemId } = await req.json();

    if (!code || !language || !problemId) {
      return NextResponse.json({ message: "Code, language, and problemId are required." }, { status: 400 });
    }

    // Get all test cases (including hidden)
    const problem = await db.codingProblem.findUnique({
      where: { id: problemId },
      include: { testCases: { orderBy: { order: "asc" } } },
    });

    if (!problem) {
      return NextResponse.json({ message: "Problem not found." }, { status: 404 });
    }

    // Run against all test cases
    const { passed, total, results, score } = await runTestCases(
      code,
      language,
      problem.testCases.map((tc) => ({ input: tc.input, output: tc.output }))
    );

    const status =
      passed === total ? "ACCEPTED" :
      passed === 0 ? "WRONG_ANSWER" :
      "PARTIAL";

    // Save submission
    const submission = await db.submission.create({
      data: {
        studentId: session.user!.id!,
        problemId,
        language,
        code,
        score: Math.round((passed / total) * problem.marks),
        status: status as any,
        passedCases: passed,
        totalCases: total,
      },
    });

    // Return only public test case results to student (hide hidden ones)
    const publicCount = problem.testCases.filter((tc) => !tc.isHidden).length;
    const publicResults = results.slice(0, publicCount);

    return NextResponse.json({
      submissionId: submission.id,
      passed,
      total,
      score: submission.score,
      totalMarks: problem.marks,
      status,
      publicResults,
      hiddenPassed: passed - publicResults.filter((r) => r.passed).length,
      hiddenTotal: total - publicCount,
    });
  } catch (error: any) {
    console.error("[CODE/SUBMIT]", error);
    return NextResponse.json({ message: error.message || "Submission failed." }, { status: 500 });
  }
}
