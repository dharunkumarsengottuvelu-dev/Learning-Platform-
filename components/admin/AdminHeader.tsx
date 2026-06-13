"use client";

import { Bell, Search } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface AdminHeaderProps {
  user: { name?: string | null; email?: string | null; role?: string; photo?: string | null };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-[#0d0d1f]/80 border-b border-white/5 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search students, tests, courses..."
            className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.photo ? (
              <img src={user.photo} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name || "A")
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-purple-400 leading-tight">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
