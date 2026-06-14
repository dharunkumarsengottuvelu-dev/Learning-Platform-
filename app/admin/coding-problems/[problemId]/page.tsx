import { db } from "@/lib/db";
import { ArrowLeft, Edit, Code2, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getDifficultyColor } from "@/lib/utils";

export default async function CodingProblemDetailsPage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;
  
  const problem = await db.codingProblem.findUnique({
    where: { id: problemId },
    include: {
      _count: { select: { testCases: true, submissions: true } }
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
        <Link href="/admin/coding-problems" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Coding Challenge Details</p>
        </div>
        <Link 
          href={`/admin/coding-problems/${problem.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Edit className="w-4 h-4" />
          Edit Problem
        </Link>
        <Link 
          href={`/admin/coding-problems/${problem.id}/test-cases`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700/20 hover:bg-blue-700/30 text-blue-300 text-sm font-medium rounded-lg transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Manage Test Cases
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Difficulty</p>
            <p className="text-lg font-bold text-white capitalize">{problem.difficulty.toLowerCase()}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Marks</p>
            <p className="text-lg font-bold text-white">{problem.marks}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Test Cases</p>
            <p className="text-lg font-bold text-white">{problem._count.testCases}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Submissions</p>
            <p className="text-lg font-bold text-white">{problem._count.submissions}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <div className="text-slate-300 text-sm leading-relaxed font-mono bg-black/20 p-4 rounded-xl border border-white/5">
            {problem.description || "No description provided."}
          </div>
        </div>
      </div>
    </div>
  );
}
