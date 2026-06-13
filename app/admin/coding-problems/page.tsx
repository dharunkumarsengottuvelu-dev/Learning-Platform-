import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Code2, Search } from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

export default async function AdminCodingProblemsPage() {
  const problems = await db.codingProblem.findMany({
    include: { _count: { select: { testCases: true, submissions: true } } },
    orderBy: { createdAt: "desc" },
  });

  const publicCounts = await Promise.all(
    problems.map((p) =>
      db.testCase.count({ where: { problemId: p.id, isHidden: false } })
    )
  );
  const hiddenCounts = await Promise.all(
    problems.map((p) =>
      db.testCase.count({ where: { problemId: p.id, isHidden: true } })
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coding Problem Bank</h1>
          <p className="text-slate-400 text-sm mt-1">{problems.length} problems in the bank</p>
        </div>
        <Link
          href="/admin/coding-problems/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          New Problem
        </Link>
      </div>

      {/* Problems grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {problems.map((problem, i) => (
          <div key={problem.id} className="glass-card p-4 hover:border-white/15 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-500">{problem.marks} marks</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">
              {problem.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{problem.description}</p>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
              <span>✅ {publicCounts[i]} public cases</span>
              <span>🔒 {hiddenCounts[i]} hidden cases</span>
              <span>📤 {problem._count.submissions} submissions</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {problem.enabledLanguages.slice(0, 5).map((lang) => (
                <span key={lang} className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">
                  {lang}
                </span>
              ))}
              {problem.enabledLanguages.length > 5 && (
                <span className="text-[10px] text-slate-500">+{problem.enabledLanguages.length - 5}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/coding-problems/${problem.id}`}
                className="flex-1 text-center text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-all"
              >
                View / Edit
              </Link>
              <Link
                href={`/admin/coding-problems/${problem.id}/test-cases`}
                className="flex-1 text-center text-xs px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-all"
              >
                Test Cases
              </Link>
            </div>
          </div>
        ))}

        {problems.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-500">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No problems yet. Create your first coding problem!</p>
            <Link href="/admin/coding-problems/create" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30 transition-all">
              <Plus className="w-4 h-4" /> Create Problem
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
