"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createTopic } from "../actions";

export default function CreateTopicPage() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await createTopic(formData);
    } catch (error) {
      console.error(error);
      setIsPending(false);
      alert("Failed to create topic");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/mcq-bank" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Topic</h1>
          <p className="text-slate-400 text-sm mt-1">Group your MCQ questions by topic</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Topic Name *</label>
            <input 
              name="name" 
              type="text"
              required
              placeholder="e.g. React Fundamentals"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="What kind of questions does this topic cover?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : <><Save className="w-4 h-4" /> Save Topic</>}
          </button>
        </div>
      </form>
    </div>
  );
}
