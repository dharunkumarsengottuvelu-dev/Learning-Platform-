import { db } from "@/lib/db";
import { Users, Plus, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminAssignmentsPage() {
  const assignments = await db.testAssignment.findMany({
    include: {
      test: { select: { title: true, duration: true } },
      student: { select: { name: true, email: true } },
      batch: { select: { name: true } }
    },
    orderBy: { assignedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            Test Assignments
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage active test assignments for students and batches.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          Assign Test
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-slate-500">
              <th className="text-left px-4 py-3 font-medium">Test Name</th>
              <th className="text-left px-4 py-3 font-medium">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium">Assigned On</th>
              <th className="text-left px-4 py-3 font-medium">Deadline</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{assignment.test.title}</p>
                      <p className="text-xs text-slate-500">{assignment.test.duration} mins</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {assignment.student ? (
                    <div>
                      <p className="text-slate-300 font-medium">👤 {assignment.student.name}</p>
                    </div>
                  ) : assignment.batch ? (
                    <div>
                      <p className="text-cyan-400 font-medium text-xs px-2 py-0.5 rounded bg-cyan-500/10 inline-block">
                        📚 Batch: {assignment.batch.name}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-500">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDate(assignment.assignedAt)}
                </td>
                <td className="px-4 py-3">
                  {assignment.deadline ? (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(assignment.deadline)}
                    </div>
                  ) : (
                    <span className="text-slate-500">No deadline</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium text-emerald-400 bg-emerald-500/10">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No tests have been assigned yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
