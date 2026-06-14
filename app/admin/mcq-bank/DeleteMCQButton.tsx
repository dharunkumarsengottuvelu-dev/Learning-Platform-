"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteMCQ } from "./actions";

export default function DeleteMCQButton({ questionId }: { questionId: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      onClick={async () => {
        if (confirm("Are you sure you want to delete this MCQ? This action cannot be undone.")) {
          setIsPending(true);
          try {
            await deleteMCQ(questionId);
          } catch (e) {
            console.error(e);
            alert("Failed to delete MCQ");
          } finally {
            setIsPending(false);
          }
        }
      }}
      disabled={isPending}
      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all disabled:opacity-50"
      title="Delete MCQ"
    >
      {isPending ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
