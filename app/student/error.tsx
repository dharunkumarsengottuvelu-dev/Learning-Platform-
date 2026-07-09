"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Something Went Wrong</h1>
        <p className="text-slate-400 text-sm mb-1">
          An unexpected error occurred. Our team has been notified.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-red-400 text-xs font-mono bg-red-950/20 border border-red-500/20 rounded p-3 mb-4 text-left whitespace-pre-wrap break-all">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/student/dashboard"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
