"use client";
import { useState } from "react";
import { addLesson, deleteLesson, updateLesson } from "./actions";
import { Video, Plus, Trash2, GripVertical, FileText, PlayCircle, Edit } from "lucide-react";

export default function LessonManager({ courseId, initialLessons }: { courseId: string, initialLessons: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleAdd(formData: FormData) {
    setIsPending(true);
    await addLesson(courseId, formData);
    setIsAdding(false);
    setIsPending(false);
  }

  async function handleUpdate(lessonId: string, formData: FormData) {
    setIsPending(true);
    await updateLesson(courseId, lessonId, formData);
    setEditingId(null);
    setIsPending(false);
  }

  async function handleDelete(lessonId: string) {
    if (confirm("Are you sure you want to delete this topic?")) {
      setIsPending(true);
      await deleteLesson(courseId, lessonId);
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-red-500" />
          Course Topics & Videos
        </h2>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Topic Video
          </button>
        )}
      </div>

      {isAdding && (
        <form action={handleAdd} className="glass-card p-6 space-y-4 border border-blue-600/20 relative overflow-hidden">
          {isPending && (
            <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <h3 className="text-white font-medium mb-4">Add New Topic</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title *</label>
              <input 
                type="text" 
                name="title" 
                required
                placeholder="e.g. Introduction to Variables"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">YouTube URL *</label>
              <input 
                type="url" 
                name="videoUrl" 
                required
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea 
              name="description" 
              rows={2}
              placeholder="Brief description of this topic..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Save Topic
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {initialLessons.map((lesson, index) => {
          if (editingId === lesson.id) {
            return (
              <form key={lesson.id} action={(formData) => handleUpdate(lesson.id, formData)} className="glass-card p-6 space-y-4 border border-cyan-500/20 relative overflow-hidden">
                {isPending && (
                  <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <h3 className="text-white font-medium mb-4">Edit Topic</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      required
                      defaultValue={lesson.title}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">YouTube URL *</label>
                    <input 
                      type="url" 
                      name="videoUrl" 
                      required
                      defaultValue={lesson.videoUrl || ""}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
                  <textarea 
                    name="description" 
                    rows={2}
                    defaultValue={lesson.content || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Update Topic
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div key={lesson.id} className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-all group">
              <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-slate-400 text-xs">
                {index + 1}
              </div>

              <div className="flex-1">
                <h4 className="text-white font-medium">{lesson.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  {lesson.videoUrl && (
                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                      <PlayCircle className="w-3.5 h-3.5" />
                      Watch Video
                    </a>
                  )}
                  {lesson.content && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <FileText className="w-3.5 h-3.5" />
                      Has Notes
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingId(lesson.id)}
                  disabled={isPending}
                  className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all disabled:opacity-50"
                  title="Edit Topic"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(lesson.id)}
                  disabled={isPending}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-50"
                  title="Delete Topic"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {initialLessons.length === 0 && !isAdding && (
          <div className="text-center py-12 glass-card border-dashed">
            <Video className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" />
            <h3 className="text-white font-medium mb-1">No Topics Added</h3>
            <p className="text-slate-400 text-sm">Create the first topic and add a YouTube URL to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
