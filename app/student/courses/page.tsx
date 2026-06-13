import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Search, PlayCircle, Star, Clock } from "lucide-react";

export default async function StudentCoursesPage() {
  const session = await auth();
  const studentId = session?.user?.id!;

  const enrollments = await db.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          lessons: {
            select: { id: true }
          }
        }
      }
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-slate-400 text-sm mt-1">Continue learning and tracking your progress.</p>
        </div>
        
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {enrollments.map((e) => {
            const progress = e.progress || 0;
            const totalLessons = e.course.lessons.length;
            const completedLessons = Math.round((progress / 100) * totalLessons);

            return (
              <Link 
                key={e.id} 
                href={`/student/courses/${e.course.id}`}
                className="glass-card overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-900/40 to-indigo-900/40 relative overflow-hidden flex items-center justify-center">
                  {e.course.thumbnail ? (
                    <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-purple-400/50" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {e.course.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {e.course.duration || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {e.course.difficulty}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5">
                      <span>{completedLessons} / {totalLessons} lessons</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No Courses Yet</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            You haven't been enrolled in any courses yet. When an administrator assigns a course to you, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
