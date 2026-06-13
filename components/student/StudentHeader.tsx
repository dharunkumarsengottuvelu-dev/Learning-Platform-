"use client";

import { Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function StudentHeader({ user }: { user: any }) {
  return (
    <header className="h-14 bg-[#0d0d1f]/80 border-b border-white/5 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      <div className="ml-auto flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.photo ? (
              <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name || "S")
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-cyan-400 leading-tight">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
