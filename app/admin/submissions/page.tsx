import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

export default async function AdminSubmissionsPage() {
  const submissions = await db.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { name: true, email: true } },
      problem: { select: { title: true, difficulty: true } },
    },
    take: 50, // Limit to 50 for performance
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "WRONG_ANSWER": return <XCircle className="w-4 h-4 text-red-400" />;
      case "PENDING": return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "WRONG_ANSWER": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Submissions Review</h1>
          <p className="text-slate-400 text-sm mt-1">Review student code submissions and manual grading</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Problem</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-sky-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {sub.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{sub.student.name}</p>
                        <p className="text-xs text-slate-500">{sub.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-medium">{sub.problem.title}</p>
                    <p className="text-xs text-slate-500">{sub.language}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(sub.status)}`}>
                      {getStatusIcon(sub.status)}
                      {sub.status.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className="font-semibold">{sub.score}</span>
                    <span className="text-slate-500 text-xs">/100</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No submissions found.
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
