"use client";
import Link from "next/link";
import { ArrowLeft, Save, ClipboardList } from "lucide-react";
import { createTest } from "./actions";
import { useState } from "react";

export default function CreateTestPage() {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/tests" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Test</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your assessment details below.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setIsPending(true);
          try {
            await createTest(formData);
          } catch (e) {
            console.error(e);
            setIsPending(false);
          }
        }} 
        className="glass-card p-6 space-y-6 relative overflow-hidden"
      >
        {isPending && (
          <div className="absolute inset-0 bg-[#0a0a1a]/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Test Title *</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="e.g. Data Structures Assessment"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="Provide a brief description of the test..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Test Type</label>
              <select 
                name="type"
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              >
                <option value="CODING">Coding Test (Programming Challenges)</option>
                <option value="MCQ">MCQ Test (Multiple Choice)</option>
                <option value="MIXED">Mixed (Coding + MCQ)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (minutes) *</label>
              <input 
                type="number" 
                name="duration" 
                required
                min="1"
                placeholder="e.g. 60"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Total Marks *</label>
              <input 
                type="number" 
                name="totalMarks" 
                required
                min="1"
                defaultValue="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Passing Marks *</label>
              <input 
                type="number" 
                name="passingMarks" 
                required
                min="0"
                defaultValue="40"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Link 
            href="/admin/tests"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
}
