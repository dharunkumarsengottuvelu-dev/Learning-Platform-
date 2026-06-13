"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", department: "", year: "", phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          college: form.college, department: form.department,
          year: form.year, phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, type = "text", placeholder }: {
    name: keyof typeof form; label: string; type?: string; placeholder?: string;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-700/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-3 shadow-lg shadow-purple-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join Training Compiler as a Student</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <InputField name="name" label="Full Name" placeholder="John Doe" />
              </div>
              <div className="col-span-2">
                <InputField name="email" label="Email Address" type="email" placeholder="you@example.com" />
              </div>
              <InputField name="password" label="Password" type="password" placeholder="Min. 8 characters" />
              <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" />
              <InputField name="phone" label="Phone Number" placeholder="+91 9876543210" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Year</label>
                <select
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                >
                  <option value="" className="bg-slate-800">Select Year</option>
                  <option value="1st Year" className="bg-slate-800">1st Year</option>
                  <option value="2nd Year" className="bg-slate-800">2nd Year</option>
                  <option value="3rd Year" className="bg-slate-800">3rd Year</option>
                  <option value="4th Year" className="bg-slate-800">4th Year</option>
                  <option value="Graduate" className="bg-slate-800">Graduate</option>
                </select>
              </div>
              <div className="col-span-2">
                <InputField name="college" label="College / University" placeholder="Anna University" />
              </div>
              <div className="col-span-2">
                <InputField name="department" label="Department" placeholder="Computer Science & Engineering" />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
