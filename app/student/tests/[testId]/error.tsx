"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TestDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Failed to Load Test</h2>
        <p className="text-slate-400 text-sm mb-5">
          {error.message?.includes("not found")
            ? "This test does not exist or is no longer available."
            : "Something went wrong while loading this test. Please try again."}
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
            All Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
