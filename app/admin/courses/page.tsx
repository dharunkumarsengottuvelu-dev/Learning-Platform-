import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, BookOpen, Users, Layers } from "lucide-react";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: {
      creator: { select: { name: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    PUBLISHED: "text-emerald-400 bg-emerald-500/10",
    DRAFT: "text-amber-400 bg-amber-500/10",
    ARCHIVED: "text-slate-400 bg-slate-500/10",
  };

  const difficultyColor: Record<string, string> = {
    EASY: "text-emerald-400",
    MEDIUM: "text-amber-400",
    HARD: "text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Course Management</h1>
          <p className="text-slate-400 text-sm mt-1">{courses.length} total courses</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="glass-card overflow-hidden hover:border-white/15 transition-all group">
            <div className="h-32 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[course.status]}`}>
                  {course.status}
                </span>
                <span className={`text-xs font-medium ${difficultyColor[course.difficulty]}`}>
                  {course.difficulty}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{course.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {course._count.enrollments} students
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {course._count.lessons} lessons
                </div>
                {course.duration && <span>{course.duration}</span>}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="flex-1 text-center text-xs py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-all"
                >
                  View
                </Link>
                <Link
                  href={`/admin/courses/${course.id}/edit`}
                  className="flex-1 text-center text-xs py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-all"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No courses yet. Create your first course!</p>
          </div>
        )}
      </div>
    </div>
  );
}
