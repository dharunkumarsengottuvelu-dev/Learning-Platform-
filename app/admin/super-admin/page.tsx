import { db } from "@/lib/db";
import { Shield, UserCog, AlertTriangle, MoreVertical } from "lucide-react";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function SuperAdminPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  // Strict role check
  if (role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 text-sm">
            This module is strictly restricted to Super Admin accounts. Your current role is <strong className="text-white">{role || "UNKNOWN"}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            Super Admin Controls
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage system administrators and top-level privileges.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20">
          <UserCog className="w-4 h-4" />
          Add Administrator
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-slate-500">
              <th className="text-left px-4 py-3 font-medium">Administrator</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Joined Date</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {admin.name?.[0] || "A"}
                    </div>
                    <div>
                      <p className="text-white font-medium">{admin.name}</p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${admin.role === 'SUPER_ADMIN' ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDate(admin.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
