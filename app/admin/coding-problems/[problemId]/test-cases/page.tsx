import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TestCaseManager from "./TestCaseManager";

export default async function CodingProblemTestCasesPage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;

  const problem = await db.codingProblem.findUnique({
    where: { id: problemId },
    include: {
      testCases: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Problem Not Found</h1>
        <Link href="/admin/coding-problems" className="text-blue-400 hover:text-blue-300">
          Return to Problem Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/coding-problems/${problem.id}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{problem.title} - Test Cases</h1>
          <p className="text-slate-400 text-sm mt-1">Manage test cases to validate student submissions.</p>
        </div>
      </div>

      <TestCaseManager problemId={problem.id} testCases={problem.testCases} />
    </div>
  );
}
