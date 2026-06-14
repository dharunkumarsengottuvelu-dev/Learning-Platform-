"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteTestAssignment } from "./actions";

export default function DeleteAssignmentButton({ assignmentId }: { assignmentId: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      onClick={async () => {
        if (confirm("Are you sure you want to delete this test assignment?")) {
          setIsPending(true);
          try {
            await deleteTestAssignment(assignmentId);
          } catch (e) {
            console.error(e);
            alert("Failed to delete assignment");
            setIsPending(false);
          }
        }
      }}
      disabled={isPending}
      className="p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Assignment"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
