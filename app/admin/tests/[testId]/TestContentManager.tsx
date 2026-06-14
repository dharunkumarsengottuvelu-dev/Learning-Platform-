"use client";

import { ClipboardList, Trash2, Code, FileText } from "lucide-react";
import AddQuestionModal from "./AddQuestionModal";
import Link from "next/link";
import { deleteQuestion } from "./actions";

type Question = {
  id: string;
  title: string;
  type: string;
  marks: number;
  options: string | null;
  correctAnswer: string | null;
};

type CodingProblem = {
  id: string;
  title: string;
  difficulty: string;
  marks: number;
};

export default function TestContentManager({ 
  testId, 
  questions, 
  codingProblems 
}: { 
  testId: string; 
  questions: Question[]; 
  codingProblems: CodingProblem[];
}) {

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            Test Content Manager
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage multiple-choice questions and coding problems.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/admin/coding-problems/create?testId=${testId}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all border border-white/10"
          >
            <Code className="w-4 h-4" />
            Add Coding Problem
          </Link>
          <AddQuestionModal testId={testId} />
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 && codingProblems.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <FileText className="w-12 h-12 mx-auto text-slate-500 opacity-50 mb-3" />
            <p className="text-slate-400 text-sm">No questions added yet. Start by adding an MCQ or Coding Problem.</p>
          </div>
        )}

        {questions.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Multiple Choice Questions</h3>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const opts = q.options ? JSON.parse(q.options) : [];
                const ans = q.correctAnswer ? JSON.parse(q.correctAnswer) : [];
                return (
                  <div key={q.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                      Q{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-white font-medium mb-3">{q.title}</p>
                        <span className="shrink-0 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          {q.marks} Marks
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {opts.map((opt: string, i: number) => {
                          const isCorrect = ans.includes(opt);
                          return (
                            <div key={i} className={`p-2 text-sm rounded-lg border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-black/20 border-white/5 text-slate-300'}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (confirm("Delete this question?")) {
                          await deleteQuestion(testId, q.id);
                        }
                      }}
                      className="shrink-0 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all self-start"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {codingProblems.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 mt-6">Coding Problems</h3>
            <div className="space-y-3">
              {codingProblems.map((cp, idx) => (
                <div key={cp.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                      C{idx + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{cp.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{cp.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {cp.marks} Marks
                    </span>
                    <Link 
                      href={`/admin/coding-problems/${cp.id}`}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      View Code
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
