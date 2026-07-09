"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CodingProblemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-[#020617]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Failed to Load Problem</h1>
        <p className="text-slate-400 text-sm mb-6">
          {error.message?.includes("not found")
            ? "This problem does not exist or has been removed."
            : "Something went wrong while loading this coding problem. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            Try Again
          </button>
          <Link
            href="/student/tests"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-all"
          >
            Back to Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
