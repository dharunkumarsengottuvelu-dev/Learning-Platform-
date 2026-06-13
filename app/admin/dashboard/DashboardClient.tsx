"use client";

import { Users, BookOpen, ClipboardList, Code2, TrendingUp, Award, Activity, Zap } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const performanceData = [
  { month: "Jan", students: 45, submissions: 120, passed: 89 },
  { month: "Feb", students: 72, submissions: 198, passed: 154 },
  { month: "Mar", students: 91, submissions: 267, passed: 201 },
  { month: "Apr", students: 118, submissions: 345, passed: 278 },
  { month: "May", students: 142, submissions: 412, passed: 332 },
  { month: "Jun", students: 167, submissions: 489, passed: 391 },
];

const testCompletionData = [
  { name: "Python Assessment", completed: 87, pending: 13 },
  { name: "Java Mock Test", completed: 72, pending: 28 },
  { name: "DSA Round", completed: 65, pending: 35 },
  { name: "Aptitude Test", completed: 91, pending: 9 },
  { name: "MERN Stack", completed: 58, pending: 42 },
];

const languageData = [
  { name: "Python", value: 35, color: "#a855f7" },
  { name: "JavaScript", value: 25, color: "#6366f1" },
  { name: "Java", value: 20, color: "#22d3ee" },
  { name: "C++", value: 12, color: "#10b981" },
  { name: "Others", value: 8, color: "#f59e0b" },
];

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div className="glass-card p-5 hover:border-white/15 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-white mt-1 group-hover:gradient-text transition-all">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

const customTooltipStyle = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

export default function DashboardClient({ stats, user }: { stats: any; user: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here&apos;s what&apos;s happening on your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents || 0} sub="+12% this month" color="bg-purple-600" />
        <StatCard icon={BookOpen} label="Active Courses" value={stats.totalCourses || 0} sub="5 published" color="bg-indigo-600" />
        <StatCard icon={ClipboardList} label="Total Tests" value={stats.totalTests || 0} sub={`${stats.activeTests || 0} active now`} color="bg-cyan-600" />
        <StatCard icon={Code2} label="Submissions" value={stats.totalSubmissions || 0} sub="All time" color="bg-emerald-600" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart - Student Growth */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Student Performance</h2>
              <p className="text-xs text-slate-500">Submissions vs Passed — last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+18.2%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="gradSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="submissions" stroke="#a855f7" fill="url(#gradSub)" strokeWidth={2} name="Submissions" />
              <Area type="monotone" dataKey="passed" stroke="#10b981" fill="url(#gradPass)" strokeWidth={2} name="Passed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Language Usage */}
        <div className="glass-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Language Usage</h2>
            <p className="text-xs text-slate-500">Code submissions by language</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={languageData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {languageData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {languageData.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px] text-slate-400">{l.name}</span>
                <span className="text-[11px] text-slate-300 ml-auto">{l.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart - Test Completion */}
        <div className="glass-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Test Completion Rate</h2>
            <p className="text-xs text-slate-500">Completed vs Pending per test</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testCompletionData} layout="vertical" barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="completed" fill="#a855f7" radius={[0, 4, 4, 0]} name="Completed" />
              <Bar dataKey="pending" fill="#334155" radius={[0, 4, 4, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Submissions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
              <p className="text-xs text-slate-500">Latest code submissions</p>
            </div>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-2.5">
            {stats.recentSubmissions?.length > 0 ? (
              stats.recentSubmissions.map((sub: any) => (
                <div key={sub.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 hover:bg-white/5 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {sub.student?.name?.charAt(0) || "S"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{sub.student?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{sub.problem?.title}</p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      sub.status === "ACCEPTED" ? "bg-emerald-500/15 text-emerald-400" :
                      sub.status === "WRONG_ANSWER" ? "bg-red-500/15 text-red-400" :
                      "bg-amber-500/15 text-amber-400"
                    }`}>
                      {sub.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No submissions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
