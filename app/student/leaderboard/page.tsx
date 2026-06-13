import { db } from "@/lib/db";
import { Trophy } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default async function LeaderboardPage() {
  // Aggregate scores per student
  const raw = await db.submission.groupBy({
    by: ["studentId"],
    _sum: { score: true },
    _count: { id: true },
    orderBy: { _sum: { score: "desc" } },
    take: 50,
  });

  const studentIds = raw.map((r) => r.studentId);
  const students = await db.user.findMany({
    where: { id: { in: studentIds } },
    select: { id: true, name: true, photo: true, college: true },
  });

  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]));

  const leaderboard = raw.map((r, i) => ({
    rank: i + 1,
    student: studentMap[r.studentId],
    totalScore: r._sum.score || 0,
    submissions: r._count.id,
  }));

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" /> Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Top performers across all coding submissions.</p>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
            if (!entry) return null;
            const sizes = ["w-16 h-16", "w-20 h-20", "w-14 h-14"];
            const heights = ["mt-6", "mt-0", "mt-8"];
            return (
              <div key={entry.rank} className={`glass-card p-4 text-center ${heights[i]}`}>
                <div className={`${sizes[i]} rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-lg font-bold text-white mx-auto mb-2`}>
                  {getInitials(entry.student?.name || "?")}
                </div>
                <p className="text-lg">{[medals[1], medals[0], medals[2]][i]}</p>
                <p className="text-sm font-semibold text-white mt-1 truncate">{entry.student?.name}</p>
                <p className="text-xs text-slate-500 truncate">{entry.student?.college}</p>
                <p className="text-xl font-bold gradient-text mt-2">{entry.totalScore}</p>
                <p className="text-xs text-slate-500">points</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">All Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Rank</th>
                <th className="text-left px-4 py-3 font-medium">Student</th>
                <th className="text-left px-4 py-3 font-medium">College</th>
                <th className="text-right px-4 py-3 font-medium">Submissions</th>
                <th className="text-right px-4 py-3 font-medium">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${entry.rank <= 3 ? "gradient-text" : "text-slate-400"}`}>
                      {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {getInitials(entry.student?.name || "?")}
                      </div>
                      <span className="text-white text-sm font-medium">{entry.student?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{entry.student?.college || "—"}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{entry.submissions}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-white">{entry.totalScore}</span>
                    <span className="text-slate-500 text-xs ml-1">pts</span>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                    <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No submissions yet. Be the first!
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
