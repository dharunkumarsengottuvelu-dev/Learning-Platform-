"use client";

import { useState } from "react";
import { Plus, Trash2, EyeOff, Eye, AlertCircle, Edit2, Save, X } from "lucide-react";
import { createTestCase, deleteTestCase, updateTestCase } from "./actions";

type TestCase = {
  id: string;
  input: string;
  output: string;
  isHidden: boolean;
};

export default function TestCaseManager({ 
  problemId, 
  testCases 
}: { 
  problemId: string; 
  testCases: TestCase[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Test Cases</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage public and hidden test cases for this coding problem.
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Test Case
        </button>
      </div>

      {isFormOpen && (
        <form 
          action={async (formData) => {
            setIsPending(true);
            try {
              await createTestCase(problemId, formData);
              setIsFormOpen(false);
            } catch (e) {
              console.error(e);
              alert("Failed to create test case.");
            } finally {
              setIsPending(false);
            }
          }}
          className="glass-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 border border-blue-500/30"
        >
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">New Test Case</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Input Data *</label>
              <textarea 
                name="input"
                required
                rows={4}
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                placeholder="E.g., 5\n1 2 3 4 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expected Output *</label>
              <textarea 
                name="output"
                required
                rows={4}
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                placeholder="E.g., 15"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="isHidden"
                  className="peer sr-only"
                />
                <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Hidden Test Case</p>
                <p className="text-xs text-slate-400">Will not be visible to students during basic runs.</p>
              </div>
            </label>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Test Case"}
              </button>
            </div>
          </div>
        </form>
      )}

      {testCases.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-white/10">
          <AlertCircle className="w-12 h-12 mx-auto text-slate-500 opacity-50 mb-3" />
          <h3 className="text-white font-medium">No Test Cases</h3>
          <p className="text-slate-400 text-sm mt-1 mb-4">Add some test cases to evaluate student code.</p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors border border-white/10"
          >
            Add First Test Case
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {testCases.map((tc, idx) => {
            if (editingId === tc.id) {
              return (
                <form 
                  key={tc.id}
                  action={async (formData) => {
                    setIsPending(true);
                    try {
                      await updateTestCase(problemId, tc.id, formData);
                      setEditingId(null);
                    } catch (e) {
                      console.error(e);
                      alert("Failed to update test case.");
                    } finally {
                      setIsPending(false);
                    }
                  }}
                  className="glass-card p-6 space-y-4 border border-blue-500/50"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      Edit Test Case
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Input Data *</label>
                      <textarea 
                        name="input"
                        required
                        defaultValue={tc.input}
                        rows={4}
                        className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Expected Output *</label>
                      <textarea 
                        name="output"
                        required
                        defaultValue={tc.output}
                        rows={4}
                        className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          name="isHidden"
                          defaultChecked={tc.isHidden}
                          className="peer sr-only"
                        />
                        <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Hidden Test Case</p>
                      </div>
                    </label>

                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              );
            }

            return (
            <div key={tc.id} className="glass-card p-5 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
              {tc.isHidden && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="bg-amber-500/20 text-amber-500 text-[10px] font-bold py-1 w-[80px] text-center transform rotate-45 absolute top-3 -right-6 shadow-sm">
                    HIDDEN
                  </div>
                </div>
              )}
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {tc.isHidden ? (
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <EyeOff className="w-4 h-4" /> Hidden Case
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Eye className="w-4 h-4" /> Public Case
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-lg p-3 border border-white/5 relative">
                    <span className="absolute -top-2.5 left-3 px-1.5 bg-[#0a1526] text-[10px] font-bold text-slate-400 uppercase tracking-wider">Input</span>
                    <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap mt-1">{tc.input}</pre>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-white/5 relative">
                    <span className="absolute -top-2.5 left-3 px-1.5 bg-[#0a1526] text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Output</span>
                    <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap mt-1">{tc.output}</pre>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col items-center justify-center md:border-l border-white/10 md:pl-6 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingId(tc.id)}
                  className="p-2.5 text-slate-400 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 rounded-xl transition-all"
                  title="Edit Test Case"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Delete this test case?")) {
                      await deleteTestCase(problemId, tc.id);
                    }
                  }}
                  className="p-2.5 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete Test Case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
