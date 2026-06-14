"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCourse } from "./actions";

interface DeleteCourseButtonProps {
  courseId: string;
}

export function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    const result = await deleteCourse(courseId);
    
    if (!result.success) {
      alert("Failed to delete course: " + result.error);
      setIsDeleting(false);
    }
    // If successful, the page will be revalidated and the course will disappear
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center text-xs py-1.5 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Course"
    >
      {isDeleting ? "..." : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}
