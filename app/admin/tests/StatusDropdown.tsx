"use client";

import { useState } from "react";
import { updateTestStatus } from "./actions";

export default function StatusDropdown({ testId, currentStatus }: { testId: string, currentStatus: string }) {
  const [isPending, setIsPending] = useState(false);

  const statusColor: Record<string, string> = {
    ACTIVE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    DRAFT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    COMPLETED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    ARCHIVED: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <select
      value={currentStatus}
      disabled={isPending}
      onChange={async (e) => {
        setIsPending(true);
        try {
          await updateTestStatus(testId, e.target.value);
        } catch (error) {
          console.error(error);
          alert("Failed to update status");
        } finally {
          setIsPending(false);
        }
      }}
      className={`text-xs px-2 py-1 rounded-full font-medium outline-none cursor-pointer border ${statusColor[currentStatus] || statusColor.DRAFT} ${isPending ? 'opacity-50' : ''}`}
    >
      <option value="DRAFT" className="bg-[#13132d] text-amber-400">Draft</option>
      <option value="ACTIVE" className="bg-[#13132d] text-emerald-400">Active</option>
      <option value="COMPLETED" className="bg-[#13132d] text-blue-400">Completed</option>
      <option value="ARCHIVED" className="bg-[#13132d] text-slate-400">Archived</option>
    </select>
  );
}
