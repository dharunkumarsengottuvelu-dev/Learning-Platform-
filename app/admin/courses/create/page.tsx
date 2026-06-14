"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import { createCourse } from "./actions";
import { useState } from "react";

export default function CreateCoursePage() {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Course</h1>
          <p className="text-slate-400 text-sm mt-1">Fill in the details below to start drafting a new course.</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          setIsPending(true);
          try {
            await createCourse(formData);
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
            <label className="block text-sm font-medium text-slate-300 mb-1">Course Title *</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="e.g. Master Data Structures and Algorithms"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
            <textarea 
              name="description" 
              required
              rows={4}
              placeholder="Provide a detailed description of what students will learn..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
              <input 
                type="text" 
                name="duration" 
                placeholder="e.g. 4 weeks, 20 hours"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
              <select 
                name="difficulty"
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              >
                <option value="EASY">Easy - Beginner Friendly</option>
                <option value="MEDIUM">Medium - Intermediate</option>
                <option value="HARD">Hard - Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail URL</label>
            <input 
              type="url" 
              name="thumbnail" 
              placeholder="https://example.com/image.png"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Link 
            href="/admin/courses"
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
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}
