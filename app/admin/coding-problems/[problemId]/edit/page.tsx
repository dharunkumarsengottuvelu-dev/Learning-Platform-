import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProblemForm from "./EditProblemForm";

export default async function EditCodingProblemPage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;
  
  const problem = await db.codingProblem.findUnique({
    where: { id: problemId },
  });

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Problem Not Found</h1>
        <Link href="/admin/coding-problems" className="text-blue-400 hover:text-blue-300">
          Return to Problem Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href={`/admin/coding-problems/${problem.id}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Coding Problem</h1>
          <p className="text-slate-400 text-sm mt-1">Update details for {problem.title}</p>
        </div>
      </div>

      <EditProblemForm problem={problem} />
    </div>
  );
}
