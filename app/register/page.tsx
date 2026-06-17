"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, User, Mail, Lock, Phone, GraduationCap, Building, BookOpen, Loader2 } from "lucide-react";

const InputField = ({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  icon: Icon,
  value,
  onChange
}: {
  name: string; 
  label: string; 
  type?: string; 
  placeholder?: string; 
  icon: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all sm:text-sm"
      />
    </div>
  </div>
);

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
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-700/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-sky-700/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-sky-600 mb-5 shadow-lg shadow-blue-600/30">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">Join Training Compiler to start your journey</p>
        </div>

        <div className="glass-card sm:rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="shrink-0">⚠️</div>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputField name="name" label="Full Name" placeholder="John Doe" icon={User} value={form.name} onChange={handleChange} />
              </div>
              
              <div className="sm:col-span-2">
                <InputField name="email" label="Email Address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={handleChange} />
              </div>

              <InputField name="password" label="Password" type="password" placeholder="Min 8 chars" icon={Lock} value={form.password} onChange={handleChange} />
              <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" icon={Lock} value={form.confirmPassword} onChange={handleChange} />
              
              <InputField name="phone" label="Phone Number" placeholder="+91 9876543210" icon={Phone} value={form.phone} onChange={handleChange} />

              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-slate-300">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all sm:text-sm appearance-none"
                  >
                    <option value="" className="bg-[#0f172a] text-slate-400">Select Year</option>
                    <option value="1st Year" className="bg-[#0f172a]">1st Year</option>
                    <option value="2nd Year" className="bg-[#0f172a]">2nd Year</option>
                    <option value="3rd Year" className="bg-[#0f172a]">3rd Year</option>
                    <option value="4th Year" className="bg-[#0f172a]">4th Year</option>
                    <option value="Graduate" className="bg-[#0f172a]">Graduate</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <InputField name="college" label="College / University" placeholder="Anna University" icon={Building} value={form.college} onChange={handleChange} />
              </div>

              <div className="sm:col-span-2">
                <InputField name="department" label="Department" placeholder="Computer Science & Engineering" icon={BookOpen} value={form.department} onChange={handleChange} />
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
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
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in to your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
