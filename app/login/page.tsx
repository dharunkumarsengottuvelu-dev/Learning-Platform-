"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, Mail, Lock, Loader2, ArrowRight, Zap } from "lucide-react";

function getErrorMessage(error: string): string {
  if (error === "CredentialsSignin" || error === "Configuration") {
    return "Invalid email or password. Please try again.";
  }
  if (error === "User not found") return "No account found with this email.";
  if (error === "Incorrect password") return "Incorrect password. Please try again.";
  if (error === "User has no password set") return "This account uses a different sign-in method.";
  return "Invalid email or password. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-sky-700/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-sky-600 mb-5 shadow-lg shadow-blue-600/30">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to your Training Compiler account</p>
        </div>

        {/* Card */}
        <div className="glass-card sm:rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="shrink-0">⚠️</div>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] focus:ring-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-slate-400" style={{ background: "inherit" }}>
                New to Training Compiler?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create an account →
            </Link>
          </div>
        </div>

        {/* Demo Logins */}
        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-xs text-slate-400 text-center mb-3 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="font-semibold text-white">Quick Demo Login</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => quickLogin("admin@tc.com", "Admin@123")}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-medium transition-all"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => quickLogin("student1@tc.com", "Student@123")}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 font-medium transition-all"
            >
              🎓 Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
