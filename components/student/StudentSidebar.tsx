"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LayoutDashboard, BookOpen, ClipboardList, Trophy, User, Award, LogOut, Code2, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/courses", icon: BookOpen, label: "My Courses" },
  { href: "/student/tests", icon: ClipboardList, label: "Tests" },
  { href: "/student/results", icon: Code2, label: "My Results" },
  { href: "/student/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/student/certificates", icon: Award, label: "Certificates" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col bg-[#0d0d1f] border-r border-white/5 transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-tight">Training</p>
            <p className="text-xs text-cyan-400 leading-tight">Student Portal</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-slate-500 hover:text-white transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                    isActive ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-white")} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-2 pb-4 border-t border-white/5 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
