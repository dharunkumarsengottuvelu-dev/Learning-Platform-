import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Code2, CheckCircle2, XCircle, Clock } from "lucide-react";

export default async function StudentResultsPage() {
  const session = await auth();
  const studentId = session?.user?.id!;

  const submissions = await db.submission.findMany({
    where: { studentId },
    include: { problem: { select: { title: true, difficulty: true, marks: true, test: { select: { title: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Results</h1>
        <p className="text-slate-400 text-sm mt-1">{submissions.length} total submissions</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        {[
          { label: "Total Submissions", value: submissions.length, color: "text-white" },
          { label: "Accepted", value: submissions.filter((s) => s.status === "ACCEPTED").length, color: "text-emerald-400" },
          { label: "Total Score", value: submissions.reduce((s, sub) => s + sub.score, 0), color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Submission History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Problem</th>
                <th className="text-left px-4 py-3 font-medium">Test</th>
                <th className="text-left px-4 py-3 font-medium">Language</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Score</th>
                <th className="text-right px-4 py-3 font-medium">Test Cases</th>
                <th className="text-right px-4 py-3 font-medium">Time</th>
                <th className="text-right px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{sub.problem.title}</p>
                    <p className="text-xs text-slate-500">{sub.problem.difficulty}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{sub.problem.test?.title || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-white/5 text-slate-300 px-2 py-0.5 rounded font-mono">{sub.language}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-medium">{sub.score}/{sub.problem.marks}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-400">{sub.passedCases}/{sub.totalCases}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-400">{sub.executionTime ? `${sub.executionTime}ms` : "—"}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-sm">
                    <Code2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No submissions yet. Start solving problems!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
