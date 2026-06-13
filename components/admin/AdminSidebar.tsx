"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, ClipboardList, Code2, Users,
  BarChart3, Award, Settings, LogOut, Menu, X, GraduationCap,
  Layers, UserCog, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Learning",
    items: [
      { href: "/admin/courses", icon: BookOpen, label: "Courses" },
      { href: "/admin/tests", icon: ClipboardList, label: "Tests" },
      { href: "/admin/coding-problems", icon: Code2, label: "Coding Problems" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/students", icon: GraduationCap, label: "Students" },
      { href: "/admin/batches", icon: Layers, label: "Batches" },
      { href: "/admin/assignments", icon: Users, label: "Assignments" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/reports", icon: BarChart3, label: "Reports" },
      { href: "/admin/certificates", icon: Award, label: "Certificates" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/super-admin", icon: UserCog, label: "Super Admin" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-[#0d0d1f] border-r border-white/5 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">Training</p>
            <p className="text-xs text-purple-400 leading-tight">Compiler</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-2 mb-2">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                        isActive
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-white")} />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && isActive && <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
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
