import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditCourseForm from "./EditCourseForm";
import LessonManager from "../LessonManager";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
    }
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Course Not Found</h1>
        <Link href="/admin/courses" className="text-blue-400 hover:text-blue-300">
          Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/courses/${course.id}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Course</h1>
          <p className="text-slate-400 text-sm mt-1">Update details for {course.title}</p>
        </div>
      </div>

      <EditCourseForm course={course} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Course Topics & Resources</h2>
        <LessonManager courseId={course.id} initialLessons={course.lessons} />
      </div>
    </div>
  );
}
