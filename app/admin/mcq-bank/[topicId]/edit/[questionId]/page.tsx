import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditMCQForm from "./EditMCQForm";

export default async function EditMCQPage({ params }: { params: { questionId: string, topicId: string } }) {
  const { questionId, topicId } = await params;
  
  const question = await db.question.findUnique({
    where: { id: questionId }
  });

  if (!question) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <EditMCQForm question={question} topicId={topicId} />
    </div>
  );
}
