"use client";
import Link from "next/link";
import { ArrowLeft, Save, Code2 } from "lucide-react";
import { createCodingProblem } from "./actions";
import { useState } from "react";

export default function CreateCodingProblemPage() {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/coding-problems" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Coding Problem</h1>
          <p className="text-slate-400 text-sm mt-1">Add a new algorithmic challenge to the problem bank.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setIsPending(true);
          try {
            await createCodingProblem(formData);
          } catch (e) {
            console.error(e);
            setIsPending(false);
          }
        }} 
        className="glass-card p-6 space-y-6 relative overflow-hidden"
      >
        {isPending && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Problem Title *</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="e.g. Two Sum"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Problem Description (Markdown supported) *</label>
            <textarea 
              name="description" 
              required
              rows={8}
              placeholder="Describe the problem, input/output formats, and constraints..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
              <select 
                name="difficulty"
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Marks *</label>
              <input 
                type="number" 
                name="marks" 
                required
                min="1"
                defaultValue="10"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Link 
            href="/admin/coding-problems"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Create Problem
          </button>
        </div>
      </form>
    </div>
  );
}
