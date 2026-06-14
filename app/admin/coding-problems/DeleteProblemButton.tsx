"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCodingProblem } from "./actions";

export default function DeleteProblemButton({ problemId }: { problemId: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      onClick={async () => {
        if (confirm("Are you sure you want to delete this coding problem? All associated test cases and submissions will be lost.")) {
          setIsPending(true);
          try {
            await deleteCodingProblem(problemId);
          } catch (e) {
            console.error(e);
            alert("Failed to delete coding problem");
            setIsPending(false);
          }
        }
      }}
      disabled={isPending}
      className="flex items-center justify-center p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
      title="Delete Problem"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
