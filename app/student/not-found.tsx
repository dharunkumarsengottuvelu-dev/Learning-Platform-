"use client";

import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 mb-5">
          <FileQuestion className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">
          The test, problem, or page you are looking for does not exist, has been removed, or you don't have access to it.
        </p>
        <div className="flex justify-center">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
