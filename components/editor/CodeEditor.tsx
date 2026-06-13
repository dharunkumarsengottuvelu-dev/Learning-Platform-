"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Send, ChevronDown, AlertCircle, CheckCircle2, XCircle, Clock, Cpu, RotateCcw, BookOpen, EyeOff } from "lucide-react";
import { cn, getLanguageLabel, getDifficultyColor, getStatusColor } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_CODE: Record<string, string> = {
  python: `# Write your solution here\ndef solution():\n    pass\n\n# Read input\nimport sys\ninput_data = sys.stdin.read().strip()\nprint(solution())`,
  javascript: `// Write your solution here\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nlet input = [];\nrl.on('line', line => input.push(line.trim()));\nrl.on('close', () => {\n  // Your code here\n  console.log(input[0]);\n});`,
  java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Your code here\n  }\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  // Your code here\n  return 0;\n}`,
  c: `#include <stdio.h>\nint main() {\n  // Your code here\n  return 0;\n}`,
  typescript: `// Write your solution here\nconst lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\nconsole.log(lines[0]);`,
  go: `package main\nimport "fmt"\nfunc main() {\n  // Your code here\n  fmt.Println("Hello")\n}`,
  rust: `use std::io::{self, BufRead};\nfn main() {\n  let stdin = io::stdin();\n  for line in stdin.lock().lines() {\n    let line = line.unwrap();\n    println!("{}", line);\n  }\n}`,
};

interface TestCase { id: string; input: string; output: string; isHidden: boolean; }
interface Problem {
  id: string; title: string; description: string; difficulty: string;
  constraints?: string; inputFormat?: string; outputFormat?: string;
  sampleInput?: string; sampleOutput?: string; marks: number;
  enabledLanguages: string[]; testCases: TestCase[];
}

interface RunResult {
  status: string; statusId: number; stdout: string; stderr: string;
  compileOutput: string; time?: string; memory?: number;
}

interface SubmitResult {
  passed: number; total: number; score: number; totalMarks: number; status: string;
  publicResults: any[];
}

export default function CodeEditor({ problem }: { problem: Problem }) {
  const [language, setLanguage] = useState(problem.enabledLanguages[0] || "python");
  const [code, setCode] = useState(DEFAULT_CODE[language] || "// Write your solution here");
  const [activeTab, setActiveTab] = useState<"problem" | "output" | "result">("problem");
  const [customInput, setCustomInput] = useState(problem.sampleInput || "");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || "// Write your solution here");
    setShowLangMenu(false);
  };

  const handleRun = async () => {
    setRunning(true);
    setActiveTab("output");
    try {
      const res = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin: customInput }),
      });
      const data = await res.json();
      setRunResult(data);
    } catch {
      setRunResult({ status: "Error", statusId: 0, stdout: "", stderr: "Network error", compileOutput: "", });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setActiveTab("result");
    try {
      const res = await fetch("/api/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemId: problem.id }),
      });
      const data = await res.json();
      setSubmitResult(data);
    } catch {
      setSubmitResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  const publicCases = problem.testCases.filter((tc) => !tc.isHidden);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#0a0a1a]">
      {/* LEFT: Problem Panel */}
      <div className="w-[40%] flex flex-col border-r border-white/5 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#0d0d1f]">
          {(["problem", "output", "result"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-xs font-medium capitalize transition-all border-b-2",
                activeTab === tab
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              {tab === "output" ? "Output" : tab === "result" ? "Submission" : "Problem"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "problem" && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h1 className="text-lg font-bold text-white">{problem.title}</h1>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getDifficultyColor(problem.difficulty))}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">{problem.marks} marks</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {problem.description}
              </div>

              {problem.constraints && (
                <div className="bg-white/3 rounded-lg p-3 border border-white/5">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Constraints</p>
                  <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap">{problem.constraints}</p>
                </div>
              )}

              {problem.inputFormat && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Input Format</p>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{problem.inputFormat}</p>
                </div>
              )}

              {problem.outputFormat && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Output Format</p>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{problem.outputFormat}</p>
                </div>
              )}

              {/* Public Test Cases */}
              {publicCases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Example Test Cases</p>
                  <div className="space-y-2">
                    {publicCases.map((tc, i) => (
                      <div key={tc.id} className="bg-white/3 rounded-lg p-3 border border-white/5">
                        <p className="text-[10px] text-slate-500 mb-1">Case {i + 1}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-slate-500 mb-0.5">Input:</p>
                            <pre className="text-xs text-white font-mono bg-black/20 p-2 rounded">{tc.input}</pre>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 mb-0.5">Output:</p>
                            <pre className="text-xs text-emerald-300 font-mono bg-black/20 p-2 rounded">{tc.output}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                    <EyeOff className="w-3 h-3" />
                    <span>+ {problem.testCases.length - publicCases.length} hidden test cases will run on submission</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "output" && (
            <div className="space-y-3">
              {/* Custom input */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Custom Input (stdin)</p>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-xs text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                  placeholder="Enter your test input here..."
                />
              </div>

              {running && (
                <div className="flex items-center gap-2 text-sm text-purple-300 bg-purple-500/10 rounded-lg p-3">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Executing your code...
                </div>
              )}

              {runResult && !running && (
                <div className="space-y-2">
                  <div className={cn("flex items-center gap-2 text-sm px-3 py-2 rounded-lg",
                    runResult.statusId === 3 ? "bg-emerald-500/10 text-emerald-400" :
                    runResult.statusId === 6 ? "bg-red-500/10 text-red-400" :
                    "bg-amber-500/10 text-amber-400"
                  )}>
                    {runResult.statusId === 3 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {runResult.status}
                    {runResult.time && <span className="ml-auto text-xs opacity-70">{runResult.time}s</span>}
                  </div>

                  {runResult.compileOutput && (
                    <div>
                      <p className="text-xs text-red-400 font-medium mb-1">Compilation Error:</p>
                      <pre className="text-xs text-red-300 font-mono bg-red-950/20 border border-red-500/20 rounded p-3 whitespace-pre-wrap overflow-x-auto">{runResult.compileOutput}</pre>
                    </div>
                  )}

                  {runResult.stderr && (
                    <div>
                      <p className="text-xs text-amber-400 font-medium mb-1">Runtime Error:</p>
                      <pre className="text-xs text-amber-300 font-mono bg-amber-950/20 border border-amber-500/20 rounded p-3 whitespace-pre-wrap overflow-x-auto">{runResult.stderr}</pre>
                    </div>
                  )}

                  {runResult.stdout && (
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">Output:</p>
                      <pre className="text-xs text-white font-mono bg-black/30 border border-white/10 rounded p-3 whitespace-pre-wrap overflow-x-auto">{runResult.stdout}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "result" && (
            <div className="space-y-3">
              {submitting && (
                <div className="flex items-center gap-2 text-sm text-purple-300 bg-purple-500/10 rounded-lg p-4">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running all test cases...
                </div>
              )}

              {submitResult && !submitting && (
                <div className="space-y-3">
                  {/* Score card */}
                  <div className={cn("rounded-xl p-4 text-center border",
                    submitResult.status === "ACCEPTED" ? "bg-emerald-500/10 border-emerald-500/20" :
                    submitResult.status === "PARTIAL" ? "bg-amber-500/10 border-amber-500/20" :
                    "bg-red-500/10 border-red-500/20"
                  )}>
                    {submitResult.status === "ACCEPTED" ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    )}
                    <p className={cn("text-lg font-bold",
                      submitResult.status === "ACCEPTED" ? "text-emerald-400" :
                      submitResult.status === "PARTIAL" ? "text-amber-400" : "text-red-400"
                    )}>
                      {submitResult.status.replace("_", " ")}
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">{submitResult.score} / {submitResult.totalMarks}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Passed {submitResult.passed} / {submitResult.total} test cases
                    </p>
                  </div>

                  {/* Public case results */}
                  {submitResult.publicResults?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-2">Test Case Results</p>
                      <div className="space-y-1.5">
                        {submitResult.publicResults.map((r: any, i: number) => (
                          <div key={i} className={cn("flex items-center gap-2 p-2.5 rounded-lg text-xs",
                            r.passed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                          )}>
                            {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                            <span className={r.passed ? "text-emerald-300" : "text-red-300"}>Case {i + 1}</span>
                            {r.time && <span className="ml-auto text-slate-500">{r.time}s</span>}
                          </div>
                        ))}
                        {(submitResult.total - submitResult.publicResults.length) > 0 && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg text-xs bg-white/3 border border-white/5">
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-slate-400">{submitResult.total - submitResult.publicResults.length} hidden test cases</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!submitResult && !submitting && (
                <div className="text-center py-12 text-slate-500">
                  <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Submit your code to see results</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d1f] border-b border-white/5">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-all"
            >
              <span>{getLanguageLabel(language)}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showLangMenu && (
              <div className="absolute top-full left-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 min-w-[140px] py-1">
                {problem.enabledLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-all",
                      lang === language ? "text-purple-300" : "text-slate-300"
                    )}
                  >
                    {getLanguageLabel(lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => setCode(DEFAULT_CODE[language] || "")}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Run */}
            <button
              id="run-code-btn"
              onClick={handleRun}
              disabled={running || submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white rounded-lg transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              Run
            </button>

            {/* Submit */}
            <button
              id="submit-code-btn"
              onClick={handleSubmit}
              disabled={running || submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs text-white rounded-lg transition-all font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Monaco */}
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language === "cpp" ? "cpp" : language === "csharp" ? "csharp" : language}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              lineNumbers: "on",
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
              smoothScrolling: true,
              tabSize: 2,
              wordWrap: "on",
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
