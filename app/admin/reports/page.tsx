import { db } from "@/lib/db";
import { BarChart3, TrendingUp, Users, Activity, Code2, Award } from "lucide-react";

export default async function AdminReportsPage() {
  const [
    totalStudents,
    totalSubmissions,
    acceptedSubmissions,
    totalTests,
    totalCourses
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.submission.count(),
    db.submission.count({ where: { status: "ACCEPTED" } }),
    db.test.count(),
    db.course.count()
  ]);

  const passRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Reports & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Key performance metrics and platform usage statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 font-medium">Total Students</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalStudents}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 font-medium">Code Submissions</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalSubmissions}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 font-medium">Avg Pass Rate</h3>
          </div>
          <p className="text-3xl font-bold text-white">{passRate}%</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 font-medium">Total Assessments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalTests}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Submission Activity</h3>
          <div className="flex-1 flex items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            <BarChart3 className="w-8 h-8 mr-2 opacity-50" />
            Chart Module In Development
          </div>
        </div>

        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Course Enrollment Trends</h3>
          <div className="flex-1 flex items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            <BarChart3 className="w-8 h-8 mr-2 opacity-50" />
            Chart Module In Development
          </div>
        </div>
      </div>
    </div>
  );
}
