"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, ClipboardList, Trophy, User, Award, Code2, Bell, LogOut, Menu, X } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/courses", icon: BookOpen, label: "Courses" },
  { href: "/student/tests", icon: ClipboardList, label: "Tests" },
  { href: "/student/results", icon: Code2, label: "Results" },
  { href: "/student/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/student/certificates", icon: Award, label: "Certificates" },
];

export default function StudentNavbar({ user }: { user: any }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a1a]/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-6 justify-between relative">
        
        {/* Logo - Takes up 1 part of flex to balance */}
        <div className="flex-1 flex justify-start">
          <Link href="/student/dashboard" className="flex items-center gap-3 shrink-0 w-fit">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">Training</p>
              <p className="text-[10px] text-cyan-400 leading-tight">Student Portal</p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links - Absolutely Centered */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-cyan-600/20 text-cyan-300" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-cyan-400" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons - Takes up 1 part of flex to balance */}
        <div className="flex-1 flex justify-end items-center gap-3 shrink-0">
          <Link href="/student/notifications" className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <Bell className="w-4 h-4" />
            {/* Notification Badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#0a0a1a]" />
          </Link>

          {/* Profile Dropdown (Hover) */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 hover:bg-white/5 p-1 pr-3 rounded-full border border-transparent hover:border-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {user?.photo ? (
                  <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user?.name || "S")
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-cyan-400 leading-tight">Student</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d1f] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right">
              <div className="p-2 space-y-1">
                <Link href="/student/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0a0a1a]">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-slate-500")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
