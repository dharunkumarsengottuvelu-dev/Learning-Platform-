import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, ClipboardList, Code2, Clock, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminTestsPage() {
  const tests = await db.test.findMany({
    include: {
      creator: { select: { name: true } },
      _count: { select: { codingProblems: true, questions: true, testAssignments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    ACTIVE: "text-emerald-400 bg-emerald-500/10",
    DRAFT: "text-amber-400 bg-amber-500/10",
    COMPLETED: "text-blue-400 bg-blue-500/10",
    ARCHIVED: "text-slate-400 bg-slate-500/10",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Test Management</h1>
          <p className="text-slate-400 text-sm mt-1">{tests.length} total tests</p>
        </div>
        <Link
          href="/admin/tests/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          New Test
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-slate-500">
              <th className="text-left px-4 py-3 font-medium">Test Name</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Duration</th>
              <th className="text-left px-4 py-3 font-medium">Problems</th>
              <th className="text-left px-4 py-3 font-medium">Assigned</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{test.title}</p>
                  <p className="text-xs text-slate-500">By {test.creator.name}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {test.type === "CODING" ? (
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span className="text-xs text-slate-300">{test.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {test.duration} min
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-300">
                  {test._count.codingProblems + test._count.questions} total
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Users className="w-3 h-3 text-slate-500" />
                    {test._count.testAssignments}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[test.status]}`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/tests/${test.id}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Edit
                    </Link>
                    <Link href={`/admin/assignments?testId=${test.id}`} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      Assign
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {tests.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No tests created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
