import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditTestForm from "./EditTestForm";

export default async function EditTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  
  const test = await db.test.findUnique({
    where: { id: testId },
  });

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Test Not Found</h1>
        <Link href="/admin/tests" className="text-purple-400 hover:text-purple-300">
          Return to Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href={`/admin/tests/${test.id}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Test</h1>
          <p className="text-slate-400 text-sm mt-1">Update details for {test.title}</p>
        </div>
      </div>

      <EditTestForm test={test} />
    </div>
  );
}
