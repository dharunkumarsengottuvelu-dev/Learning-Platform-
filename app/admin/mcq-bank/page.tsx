import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, ListChecks, Folder } from "lucide-react";
import DeleteTopicButton from "./DeleteTopicButton";

export default async function AdminMCQBankPage() {
  const topics = await db.mCQTopic.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });

  const uncategorizedCount = await db.question.count({
    where: { testId: null, mcqTopicId: null }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">MCQ Bank Topics</h1>
          <p className="text-slate-400 text-sm mt-1">{topics.length} topics</p>
        </div>
        <Link
          href="/admin/mcq-bank/create-topic"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          New Topic
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Uncategorized Topic Card */}
        <Link href="/admin/mcq-bank/uncategorized" className="glass-card p-5 hover:border-white/15 transition-all group flex flex-col h-full bg-slate-800/50">
          <div className="flex-1 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
              <Folder className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
              Uncategorized
            </h3>
            <p className="text-sm text-slate-400 mb-4">Questions not assigned to any specific topic.</p>
            <div className="mt-auto">
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                {uncategorizedCount} Questions
              </span>
            </div>
          </div>
        </Link>

        {/* Real Topics */}
        {topics.map((topic) => (
          <Link key={topic.id} href={`/admin/mcq-bank/${topic.id}`} className="glass-card p-5 hover:border-white/15 transition-all group flex flex-col h-full">
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <DeleteTopicButton topicId={topic.id} />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                {topic.name}
              </h3>
              {topic.description && (
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{topic.description}</p>
              )}
              <div className="mt-auto">
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {topic._count.questions} Questions
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
