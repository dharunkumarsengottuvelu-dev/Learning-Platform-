import { db } from "@/lib/db";
import { Award, Search, Download, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminCertificatesPage() {
  const certificates = await db.certificate.findMany({
    include: {
      student: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { issuedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates Generated</h1>
          <p className="text-slate-400 text-sm mt-1">{certificates.length} total certificates issued</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by student or certificate ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-slate-500">
              <th className="text-left px-4 py-3 font-medium">Certificate ID</th>
              <th className="text-left px-4 py-3 font-medium">Student</th>
              <th className="text-left px-4 py-3 font-medium">Course</th>
              <th className="text-left px-4 py-3 font-medium">Issued On</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-blue-400">
                  {cert.certificateId.substring(0, 12)}...
                </td>
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{cert.student.name}</p>
                  <p className="text-xs text-slate-500">{cert.student.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {cert.course.title}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDate(cert.issuedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-white transition-colors" title="Download PDF">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Verify Link">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No certificates have been issued yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
