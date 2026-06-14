import { db } from "@/lib/db";
import { Layers, Plus, Users, BookOpen, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AdminBatchesPage() {
  const batches = await db.batch.findMany({
    include: {
      course: { select: { title: true } },
      _count: { select: { testAssignments: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-blue-400" />
            Batch Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">{batches.length} total batches active.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          Create Batch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="glass-card p-5 hover:border-white/15 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                {batch.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-emerald-400 bg-emerald-500/10">
                ACTIVE
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="truncate">{batch.course?.title || "No assigned course"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Created {formatDate(batch.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{batch._count.testAssignments} pending assignments</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button className="flex-1 text-center text-xs py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-all">
                Manage Students
              </button>
              <Link href={`/admin/assignments?batchId=${batch.id}`} className="flex-1 text-center text-xs py-2 bg-blue-700/20 hover:bg-blue-700/30 text-blue-300 rounded-lg transition-all">
                Assign Test
              </Link>
            </div>
          </div>
        ))}

        {batches.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 glass-card">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No batches created yet. Group students into batches to assign tests easily.</p>
          </div>
        )}
      </div>
    </div>
  );
}
