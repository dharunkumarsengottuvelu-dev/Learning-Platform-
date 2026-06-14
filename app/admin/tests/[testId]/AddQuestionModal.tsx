"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createQuestion } from "./actions";

export default function AddQuestionModal({ testId }: { testId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  // Basic state for MCQ options
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-4 h-4" />
        Add MCQ
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Add Multiple Choice Question</h2>
            
            <form 
              action={async (formData) => {
                setIsPending(true);
                try {
                  // Attach the dynamically built JSON strings for options/answers
                  formData.append("options", JSON.stringify(options));
                  formData.append("correctAnswer", JSON.stringify([options[correctAnswerIndex]]));
                  
                  await createQuestion(testId, formData);
                  setIsOpen(false);
                  setOptions(["", "", "", ""]);
                  setCorrectAnswerIndex(0);
                } catch (e) {
                  console.error(e);
                  alert("Failed to add question");
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Question Title *</label>
                <textarea 
                  name="title" 
                  required
                  rows={3}
                  className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  placeholder="E.g., What is the output of print(2 ** 3) in Python?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Options & Correct Answer *</label>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correctIndex"
                        checked={correctAnswerIndex === idx}
                        onChange={() => setCorrectAnswerIndex(idx)}
                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input 
                        type="text" 
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className={`flex-1 bg-[#13132d] border ${correctAnswerIndex === idx ? 'border-emerald-500/50 focus:ring-emerald-500/50' : 'border-white/10 focus:ring-blue-600/50'} rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 transition-all`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Marks</label>
                  <input 
                    type="number" 
                    name="marks" 
                    defaultValue={1}
                    min={1}
                    className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Question Type</label>
                  <select 
                    name="type" 
                    className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  >
                    <option value="SINGLE_CHOICE">Single Choice</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  </select>
                </div>
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
                  {isPending ? "Saving..." : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
