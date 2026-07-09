import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Code2, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getDifficultyColor, formatDate } from "@/lib/utils";

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  const test = await db.test.findUnique({
    where: { id: testId },
    include: {
      codingProblems: {
        select: { id: true, title: true, difficulty: true, marks: true, _count: { select: { testCases: true } } },
      },
      questions: { select: { id: true, type: true, marks: true } },
    },
  });

  if (!test) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{test.title}</h1>
        {test.description && <p className="text-slate-400 text-sm mt-1">{test.description}</p>}
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Duration", value: `${test.duration} min`, icon: Clock },
          { label: "Passing Marks", value: `${test.passingMarks}/${test.totalMarks}`, icon: CheckCircle2 },
          { label: "Type", value: test.type, icon: Code2 },
        ].map((item) => (
          <div key={item.label} className="glass-card p-3 text-center">
            <item.icon className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <p className="text-lg font-bold text-white">{item.value}</p>
            <p className="text-xs text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Coding Problems */}
      {test.codingProblems.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Coding Problems ({test.codingProblems.length})</h2>
          </div>
          <div className="divide-y divide-white/5">
            {test.codingProblems.map((problem, i) => (
              <Link
                key={problem.id}
                href={`/student/tests/${testId}/coding/${problem.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-all group"
              >
                <span className="text-xs text-slate-500 w-5">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{problem.title}</p>
                  <p className="text-xs text-slate-500">{problem._count.testCases} test cases</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-slate-400">{problem.marks}pts</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {test.codingProblems.length === 0 && test.questions.length === 0 && (
        <div className="glass-card p-8 text-center text-slate-500 text-sm">
          No problems added to this test yet.
        </div>
      )}
    </div>
  );
}
