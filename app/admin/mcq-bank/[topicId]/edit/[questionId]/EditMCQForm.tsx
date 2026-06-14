"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { updateMCQ } from "../../../actions";

export default function EditMCQForm({ question, topicId }: { question: any, topicId: string }) {
  const isUncategorized = topicId === "uncategorized";
  const [isPending, setIsPending] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [type, setType] = useState(question.type);

  useEffect(() => {
    try {
      if (question.options) setOptions(JSON.parse(question.options));
      if (question.correctAnswer) setCorrectAnswers(JSON.parse(question.correctAnswer));
    } catch (e) {
      console.error(e);
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("options", JSON.stringify(options.filter(o => o.trim() !== "")));
    formData.set("correctAnswer", JSON.stringify(correctAnswers));
    
    try {
      await updateMCQ(question.id, formData);
    } catch (error) {
      console.error(error);
      setIsPending(false);
      alert("Failed to update MCQ");
    }
  };

  const toggleCorrectAnswer = (opt: string) => {
    if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
      setCorrectAnswers([opt]);
    } else if (type === "MULTIPLE_CHOICE") {
      setCorrectAnswers(prev => 
        prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={isUncategorized ? "/admin/mcq-bank/uncategorized" : `/admin/mcq-bank/${topicId}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit MCQ</h1>
          <p className="text-slate-400 text-sm mt-1">Update question details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {!isUncategorized && <input type="hidden" name="topicId" value={topicId} />}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Question Title / Text *</label>
            <textarea 
              name="title" 
              required
              rows={3}
              defaultValue={question.title}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Question Type</label>
              <select 
                name="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setCorrectAnswers([]);
                  if (e.target.value === "TRUE_FALSE") {
                    setOptions(["True", "False"]);
                  } else if (options.length === 2 && options[0] === "True") {
                    setOptions(["", "", "", ""]);
                  }
                }}
                className="w-full bg-[#13132d] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                <option value="SINGLE_CHOICE">Single Choice</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True / False</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Marks *</label>
              <input 
                type="number" 
                name="marks" 
                required
                min="1"
                defaultValue={question.marks}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Options & Correct Answer(s)</label>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCorrectAnswer(opt)}
                    disabled={!opt.trim()}
                    className={`w-6 h-6 rounded flex items-center justify-center border transition-all flex-shrink-0
                      ${type === "SINGLE_CHOICE" || type === "TRUE_FALSE" ? "rounded-full" : "rounded-md"}
                      ${correctAnswers.includes(opt) && opt.trim()
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-600 hover:border-slate-400 bg-transparent"
                      }`}
                  >
                    {correctAnswers.includes(opt) && opt.trim() && <div className="w-2.5 h-2.5 bg-white rounded-sm" style={{ borderRadius: type === "SINGLE_CHOICE" || type === "TRUE_FALSE" ? '50%' : '2px' }} />}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options];
                      const oldVal = newOptions[i];
                      newOptions[i] = e.target.value;
                      setOptions(newOptions);
                      
                      if (correctAnswers.includes(oldVal)) {
                        setCorrectAnswers(prev => prev.map(a => a === oldVal ? e.target.value : a));
                      }
                    }}
                    placeholder={`Option ${i + 1}`}
                    disabled={type === "TRUE_FALSE"}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  {type !== "TRUE_FALSE" && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = options.filter((_, idx) => idx !== i);
                        setOptions(newOptions);
                        if (correctAnswers.includes(opt)) {
                          setCorrectAnswers(prev => prev.filter(a => a !== opt));
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {type !== "TRUE_FALSE" && (
              <button
                type="button"
                onClick={() => setOptions([...options, ""])}
                className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Explanation (Optional)</label>
            <textarea 
              name="explanation" 
              rows={2}
              defaultValue={question.explanation || ""}
              placeholder="Explain why the answer is correct..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <button 
            type="submit"
            disabled={isPending || correctAnswers.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
