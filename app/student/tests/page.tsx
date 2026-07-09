import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Code2, Clock, Users, CalendarDays, ArrowLeft } from "lucide-react";
import { formatDate, getDifficultyColor } from "@/lib/utils";

export default async function StudentTestsPage() {
  const tests = await db.test.findMany({
    where: { status: "ACTIVE" },
    include: {
      _count: { select: { codingProblems: true, questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Available Tests</h1>
        <p className="text-slate-400 text-sm mt-1">All active tests assigned to you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tests.map((test) => (
          <div key={test.id} className="glass-card p-5 hover:border-white/15 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  test.type === "CODING" ? "bg-cyan-600/20" : "bg-blue-700/20"
                }`}>
                  <Code2 className={`w-4 h-4 ${test.type === "CODING" ? "text-cyan-400" : "text-blue-400"}`} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  test.type === "CODING" ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-600/10 text-blue-400"
                }`}>
                  {test.type}
                </span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1">{test.title}</h3>
            {test.description && <p className="text-xs text-slate-400 line-clamp-2 mb-3">{test.description}</p>}

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {test.duration} min
              </div>
              <div className="flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                {test._count.codingProblems} problems
              </div>
              {test.endDate && (
                <div className="flex items-center gap-1 text-amber-400">
                  <CalendarDays className="w-3 h-3" />
                  Due {formatDate(test.endDate)}
                </div>
              )}
            </div>

            <Link
              href={`/student/tests/${test.id}`}
              className="block w-full text-center py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
            >
              Start Test
            </Link>
          </div>
        ))}

        {tests.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-500">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No active tests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
