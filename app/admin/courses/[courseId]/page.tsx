import { db } from "@/lib/db";
import { ArrowLeft, Edit, BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";
import LessonManager from "./LessonManager";

export default async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: { 
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true, batches: true } }
    }
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Course Not Found</h1>
        <Link href="/admin/courses" className="text-purple-400 hover:text-purple-300">
          Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/courses" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
              {course.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage course content and topics.</p>
        </div>
        <Link 
          href={`/admin/courses/${course.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all"
        >
          <Edit className="w-4 h-4" />
          Edit Details
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Topics</p>
            <p className="text-lg font-bold text-white">{course.lessons.length}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Enrollments</p>
            <p className="text-lg font-bold text-white">{course._count.enrollments}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Difficulty</p>
            <p className="text-lg font-bold text-white">{course.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>
        </div>
      </div>

      <LessonManager courseId={course.id} initialLessons={course.lessons} />
    </div>
  );
}
