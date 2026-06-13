import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateCertificateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `TC-${timestamp}-${random}`;
}

export function getLanguageLabel(lang: string): string {
  const map: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    java: "Java",
    cpp: "C++",
    c: "C",
    csharp: "C#",
    go: "Go",
    rust: "Rust",
    php: "PHP",
  };
  return map[lang] || lang;
}

export function getJudge0LanguageId(lang: string): number {
  const map: Record<string, number> = {
    c: 50,
    cpp: 54,
    java: 62,
    python: 71,
    javascript: 63,
    typescript: 74,
    csharp: 51,
    go: 60,
    rust: 73,
    php: 68,
  };
  return map[lang] || 71;
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: "text-emerald-400 bg-emerald-400/10",
    MEDIUM: "text-amber-400 bg-amber-400/10",
    HARD: "text-red-400 bg-red-400/10",
  };
  return map[difficulty] || "text-gray-400 bg-gray-400/10";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACCEPTED: "text-emerald-400 bg-emerald-400/10",
    WRONG_ANSWER: "text-red-400 bg-red-400/10",
    TIME_LIMIT_EXCEEDED: "text-amber-400 bg-amber-400/10",
    RUNTIME_ERROR: "text-orange-400 bg-orange-400/10",
    COMPILATION_ERROR: "text-purple-400 bg-purple-400/10",
    PENDING: "text-blue-400 bg-blue-400/10",
    PARTIAL: "text-cyan-400 bg-cyan-400/10",
  };
  return map[status] || "text-gray-400 bg-gray-400/10";
}
