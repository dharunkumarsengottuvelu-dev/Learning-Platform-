import { db } from "@/lib/db";
import { ArrowLeft, Edit, Clock, Target, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function TestDetailsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  
  const test = await db.test.findUnique({
    where: { id: testId },
    include: {
      _count: { select: { testAssignments: true, questions: true, codingProblems: true } }
    }
  });

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Test Not Found</h1>
        <Link href="/admin/tests" className="text-blue-400 hover:text-blue-300">
          Return to Tests
        </Link>
      </div>
    );
  }

  const totalQuestions = test._count.questions + test._count.codingProblems;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tests" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{test.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${test.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
              {test.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">{test.type} Assessment</p>
        </div>
        <Link 
          href={`/admin/tests/${test.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Edit className="w-4 h-4" />
          Edit Details
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Questions</p>
            <p className="text-lg font-bold text-white">{totalQuestions}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Duration</p>
            <p className="text-lg font-bold text-white">{test.duration} min</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Marks</p>
            <p className="text-lg font-bold text-white">{test.totalMarks}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Passing Marks</p>
            <p className="text-lg font-bold text-white">{test.passingMarks}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{test.description || "No description provided."}</p>
        </div>
      </div>

      <div className="glass-card p-8 text-center border-dashed border-white/10">
        <ClipboardList className="w-12 h-12 mx-auto text-slate-500 opacity-50 mb-3" />
        <h3 className="text-white font-medium">Test Content Manager</h3>
        <p className="text-slate-400 text-sm mt-1 mb-4">Manage the questions and coding problems for this assessment.</p>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg transition-colors border border-white/10">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
