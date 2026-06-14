"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteTest } from "./actions";

export default function DeleteTestButton({ testId }: { testId: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      onClick={async () => {
        if (confirm("Are you sure you want to delete this test? All related assignments and questions will be lost.")) {
          setIsPending(true);
          try {
            await deleteTest(testId);
          } catch (e) {
            console.error(e);
            alert("Failed to delete test");
            setIsPending(false);
          }
        }
      }}
      disabled={isPending}
      className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Test"
    >
      {isPending ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
