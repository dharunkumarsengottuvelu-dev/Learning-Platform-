"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createTestAssignment } from "./actions";

type Test = { id: string; title: string; type: string };
type Student = { id: string; name: string; email: string };
type Batch = { id: string; name: string };

export default function AssignTestButton({
  tests,
  students,
  batches,
}: {
  tests: Test[];
  students: Student[];
  batches: Batch[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"STUDENT" | "BATCH">("STUDENT");

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-4 h-4" />
        Assign Test
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Assign New Test</h2>
            
            <form 
              action={async (formData) => {
                setIsPending(true);
                try {
                  await createTestAssignment(formData);
                  setIsOpen(false);
                } catch (e) {
                  console.error(e);
                  alert("Failed to assign test");
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Select Test *</label>
                <select 
                  name="testId" 
                  required
                  className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                >
                  <option value="">-- Choose a Test --</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assign To *</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="assignmentType" 
                      value="STUDENT"
                      checked={assignmentType === "STUDENT"}
                      onChange={() => setAssignmentType("STUDENT")}
                      className="accent-blue-600"
                    />
                    Specific Student
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="assignmentType" 
                      value="BATCH"
                      checked={assignmentType === "BATCH"}
                      onChange={() => setAssignmentType("BATCH")}
                      className="accent-blue-600"
                    />
                    Entire Batch
                  </label>
                </div>

                {assignmentType === "STUDENT" ? (
                  <select 
                    name="studentId" 
                    required
                    className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  >
                    <option value="">-- Choose a Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                ) : (
                  <select 
                    name="batchId" 
                    required
                    className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  >
                    <option value="">-- Choose a Batch --</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Deadline (Optional)</label>
                <input 
                  type="datetime-local" 
                  name="deadline"
                  className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
                >
                  {isPending ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
