"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle2, Circle, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function CourseClient({ course, enrollment }: { course: any, enrollment: any }) {
  const router = useRouter();
  const supabase = createClient();
  const lessons = course.lessons || [];
  const [activeLesson, setActiveLesson] = useState(lessons[0] || null);

  const completedLessons = Math.round((enrollment.progress / 100) * lessons.length) || 0;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] gap-6">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <Link href="/student/courses" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 w-fit transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        
        <div className="flex-1 overflow-y-auto glass-card rounded-2xl flex flex-col">
          {activeLesson ? (
            <>
              {/* Video Player Placeholder */}
              <div className="w-full aspect-video bg-black relative flex items-center justify-center overflow-hidden shrink-0 border-b border-white/10">
                {activeLesson.videoUrl ? (
                  <iframe 
                    src={activeLesson.videoUrl} 
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No video available for this lesson</p>
                  </div>
                )}
              </div>
              
              {/* Lesson Info */}
              <div className="p-6 md:p-8 flex-1">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h1>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Duration: {activeLesson.duration || "10 mins"}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Completed
                  </button>
                </div>
                
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                  {activeLesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                  ) : (
                    <p>There is no written content for this lesson.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              No lessons available in this course.
            </div>
          )}
        </div>
      </div>

      {/* Sidebar / Syllabus */}
      <div className="w-full md:w-80 lg:w-96 glass-card rounded-2xl flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white mb-1">Course Content</h2>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{completedLessons} / {lessons.length} lessons completed</span>
            <span className="text-cyan-400">{enrollment.progress || 0}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" 
              style={{ width: `${enrollment.progress || 0}%` }} 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {lessons.map((lesson: any, index: number) => {
            const isActive = activeLesson?.id === lesson.id;
            const isCompleted = index < completedLessons; // Mocking completed state based on progress percentage
            
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left p-3 rounded-xl flex gap-3 transition-all ${
                  isActive 
                    ? "bg-cyan-500/10 border border-cyan-500/20" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-medium leading-snug mb-1 ${
                    isActive ? "text-cyan-300" : isCompleted ? "text-slate-300" : "text-slate-400"
                  }`}>
                    {index + 1}. {lesson.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      {lesson.videoUrl ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {lesson.duration || "10m"}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
