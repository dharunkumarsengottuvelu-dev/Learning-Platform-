import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { BookOpen, ClipboardList, Code2, Trophy, Clock, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentDashboardPage() {
  const session = await auth();
  const studentId = session?.user?.id!;

  const [enrollments, submissions, assignments, leaderboardRank] = await Promise.all([
    db.enrollment.findMany({
      where: { studentId },
      include: { course: { select: { id: true, title: true, thumbnail: true, difficulty: true } } },
      orderBy: { enrolledAt: "desc" },
      take: 4,
    }),
    db.submission.findMany({
      where: { studentId },
      include: { problem: { select: { title: true, marks: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.testAssignment.findMany({
      where: { studentId },
      include: { test: { select: { id: true, title: true, duration: true, endDate: true, type: true } } },
      orderBy: { assignedAt: "desc" },
      take: 5,
    }),
    db.submission.groupBy({
      by: ["studentId"],
      _sum: { score: true },
      orderBy: { _sum: { score: "desc" } },
    }),
  ]);

  const totalScore = submissions.reduce((s, sub) => s + sub.score, 0);
  const avgScore = submissions.length > 0 ? Math.round(totalScore / submissions.length) : 0;
  const accepted = submissions.filter((s) => s.status === "ACCEPTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Track your learning progress and upcoming tests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Enrolled Courses", value: enrollments.length, color: "bg-purple-600" },
          { icon: ClipboardList, label: "Tests Assigned", value: assignments.length, color: "bg-indigo-600" },
          { icon: Code2, label: "Submissions", value: submissions.length, color: "bg-cyan-600" },
          { icon: Trophy, label: "Avg Score", value: `${avgScore}%`, color: "bg-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assigned Tests */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Assigned Tests</h2>
            <Link href="/student/tests" className="text-xs text-purple-400 hover:text-purple-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {assignments.length > 0 ? assignments.map((a) => (
              <Link
                key={a.id}
                href={`/student/tests/${a.test.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5 hover:border-purple-500/20 transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  a.test.type === "CODING" ? "bg-cyan-600/20" : "bg-purple-600/20"
                }`}>
                  {a.test.type === "CODING" ? <Code2 className="w-4 h-4 text-cyan-400" /> : <ClipboardList className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">{a.test.title}</p>
                  <p className="text-xs text-slate-500">{a.test.duration} min • {a.test.type}</p>
                </div>
                {a.test.endDate && (
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(a.test.endDate)}
                    </div>
                  </div>
                )}
              </Link>
            )) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No tests assigned yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
            <Link href="/student/results" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {submissions.length > 0 ? submissions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  sub.status === "ACCEPTED" ? "bg-emerald-400" :
                  sub.status === "PARTIAL" ? "bg-amber-400" : "bg-red-400"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{sub.problem.title}</p>
                  <p className="text-xs text-slate-500">{sub.language} • {formatDate(sub.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">{sub.score}/{sub.problem.marks}</p>
                  <p className={`text-[10px] ${
                    sub.status === "ACCEPTED" ? "text-emerald-400" :
                    sub.status === "PARTIAL" ? "text-amber-400" : "text-red-400"
                  }`}>{sub.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No submissions yet. Start coding!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      {enrollments.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">My Courses</h2>
            <Link href="/student/courses" className="text-xs text-purple-400 hover:text-purple-300">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {enrollments.map((e) => (
              <Link
                key={e.id}
                href={`/student/courses/${e.course.id}`}
                className="block glass rounded-xl p-3 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-purple-400 opacity-60" />
                </div>
                <p className="text-xs font-medium text-white truncate group-hover:text-purple-300 transition-colors">{e.course.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{e.course.difficulty}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
