import { db } from "@/lib/db";
import { GraduationCap, Search, Mail, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    include: {
      _count: { select: { enrollments: true, submissions: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            Student Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">{students.length} total registered students.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-slate-500">
              <th className="text-left px-4 py-3 font-medium">Student Info</th>
              <th className="text-left px-4 py-3 font-medium">Joined Date</th>
              <th className="text-left px-4 py-3 font-medium">Active Enrollments</th>
              <th className="text-left px-4 py-3 font-medium">Submissions</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {student.name?.[0] || "S"}
                    </div>
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDate(student.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-medium">
                    {student._count.enrollments}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-400 font-medium">
                    {student._count.submissions}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-xs font-medium">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Profile
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No students registered yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
