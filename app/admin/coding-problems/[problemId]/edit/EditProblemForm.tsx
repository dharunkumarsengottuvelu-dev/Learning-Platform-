"use client";
import Link from "next/link";
import { Save, Plus, Trash2, EyeOff, Eye } from "lucide-react";
import { updateCodingProblem } from "./actions";
import { useState } from "react";

export default function EditProblemForm({ problem }: { problem: any }) {
  const [isPending, setIsPending] = useState(false);

  // Initialize testCases with data from the database
  const [testCases, setTestCases] = useState(
    problem.testCases && problem.testCases.length > 0 
      ? problem.testCases.map((tc: any) => ({
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden
        }))
      : [{ input: "", output: "", isHidden: false }]
  );

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_: any, i: number) => i !== index));
  };

  const updateTestCase = (index: number, field: "input" | "output" | "isHidden", value: string | boolean) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  return (
    <form 
      action={async (formData) => {
        setIsPending(true);
        try {
          formData.append("testCases", JSON.stringify(testCases));
          await updateCodingProblem(problem.id, formData);
        } catch (e) {
          console.error(e);
          alert("Failed to update problem.");
          setIsPending(false);
        }
      }} 
      className="glass-card p-6 space-y-8 relative overflow-hidden pb-12"
    >
      {isPending && (
        <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Problem Title *</label>
          <input 
            type="text" 
            name="title" 
            required
            defaultValue={problem.title}
            className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Problem Description (Markdown supported) *</label>
          <textarea 
            name="description" 
            required
            rows={8}
            defaultValue={problem.description}
            className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
            <select 
              name="difficulty"
              defaultValue={problem.difficulty}
              className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Marks *</label>
            <input 
              type="number" 
              name="marks" 
              required
              min="1"
              defaultValue={problem.marks}
              className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Test Cases Section */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Test Cases</h3>
            <p className="text-sm text-slate-400">Edit or add test cases to evaluate the student's code.</p>
          </div>
          <button 
            type="button"
            onClick={addTestCase}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
        </div>

        <div className="space-y-4">
          {testCases.map((tc: any, index: number) => (
            <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group">
              <button 
                type="button"
                onClick={() => removeTestCase(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove test case"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs">
                  {index + 1}
                </span>
                Test Case {index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Input</label>
                  <textarea 
                    value={tc.input}
                    onChange={(e) => updateTestCase(index, "input", e.target.value)}
                    required
                    rows={2}
                    className="w-full bg-[#13132d] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Expected Output</label>
                  <textarea 
                    value={tc.output}
                    onChange={(e) => updateTestCase(index, "output", e.target.value)}
                    required
                    rows={2}
                    className="w-full bg-[#13132d] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                    placeholder="e.g. 120"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer w-fit group/toggle">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={tc.isHidden}
                    onChange={(e) => updateTestCase(index, "isHidden", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className={`text-xs font-medium flex items-center gap-1.5 transition-colors ${tc.isHidden ? 'text-amber-400' : 'text-slate-400 group-hover/toggle:text-slate-300'}`}>
                  {tc.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {tc.isHidden ? 'Hidden Case (Used only for grading)' : 'Public Case (Visible to students)'}
                </span>
              </label>
            </div>
          ))}
          {testCases.length === 0 && (
            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">
              No test cases added. Your problem won't be evaluable without test cases.
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
        <Link 
          href={`/admin/coding-problems/${problem.id}`}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </Link>
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Update Problem
        </button>
      </div>
    </form>
  );
}
