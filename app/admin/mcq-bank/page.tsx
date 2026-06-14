import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, ListChecks } from "lucide-react";
import DeleteMCQButton from "./DeleteMCQButton";

export default async function AdminMCQBankPage() {
  // Find all MCQs where testId is null (Standalone bank questions)
  // Or maybe we just list all questions. For now, let's list all standalone ones.
  const questions = await db.question.findMany({
    where: { testId: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">MCQ Bank</h1>
          <p className="text-slate-400 text-sm mt-1">{questions.length} standalone multiple choice questions</p>
        </div>
        <Link
          href="/admin/mcq-bank/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          New MCQ
        </Link>
      </div>

      {/* MCQs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {questions.map((q) => (
          <div key={q.id} className="glass-card p-4 hover:border-white/15 transition-all group flex flex-col h-full">
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400`}>
                  {q.type.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-500">{q.marks} marks</span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-2">
                {q.title}
              </h3>
              
              {q.options && (
                <div className="mt-2 space-y-1">
                  {JSON.parse(q.options).slice(0, 3).map((opt: string, i: number) => (
                    <div key={i} className="text-[11px] text-slate-400 bg-white/5 px-2 py-1 rounded truncate">
                      {opt}
                    </div>
                  ))}
                  {JSON.parse(q.options).length > 3 && (
                    <div className="text-[10px] text-slate-500">+{JSON.parse(q.options).length - 3} more options</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <Link
                href={`/admin/mcq-bank/${q.id}/edit`}
                className="flex-1 text-center text-xs px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-all"
              >
                View / Edit
              </Link>
              <DeleteMCQButton questionId={q.id} />
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No standalone MCQs yet. Create your first question!</p>
            <Link href="/admin/mcq-bank/create" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-700/20 text-blue-400 rounded-lg text-sm hover:bg-blue-700/30 transition-all">
              <Plus className="w-4 h-4" /> Create MCQ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
