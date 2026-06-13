import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Award, Download, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function CertificatesPage() {
  const session = await auth();
  const studentId = session?.user?.id!;

  // Mocking certificates by querying completed courses or tests
  const enrollments = await db.enrollment.findMany({
    where: { studentId, progress: 100 },
    include: { course: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
        <p className="text-slate-400 text-sm mt-1">View and download your earned certificates.</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div key={e.id} className="glass-card p-5 group flex flex-col relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 leading-tight">{e.course.title}</h3>
              <p className="text-xs text-emerald-400 font-medium mb-4">Completed on {formatDate(e.enrolledAt)}</p>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  Verified
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg transition-colors border border-white/10">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <Award className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Certificates Yet</h2>
          <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
            You haven't earned any certificates yet. Complete a course 100% or pass an assigned assessment to earn your first certificate!
          </p>
        </div>
      )}
    </div>
  );
}
