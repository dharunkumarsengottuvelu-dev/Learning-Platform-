import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { User, Mail, Calendar, Trophy, Code2, BookOpen, ShieldCheck, MapPin } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  const studentId = session?.user?.id!;

  const user = await db.user.findUnique({
    where: { id: studentId },
    include: {
      enrollments: true,
      submissions: true,
      testAssignments: true,
    }
  });

  if (!user) return null;

  const totalScore = user.submissions.reduce((acc, sub) => acc + sub.score, 0);
  const acceptedSubmissions = user.submissions.filter(s => s.status === "ACCEPTED").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card relative overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-cyan-900/60 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 flex justify-between items-end">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-xl bg-[#0d0d1f] flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
            </div>
            
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all font-medium">
              Edit Profile
            </button>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
              {user.name}
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {formatDate(user.createdAt)}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Student</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Score</p>
              <p className="text-2xl font-bold text-white">{totalScore}</p>
            </div>
          </div>
          
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Code2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Accepted Codes</p>
              <p className="text-2xl font-bold text-white">{acceptedSubmissions}</p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Enrolled Courses</p>
              <p className="text-2xl font-bold text-white">{user.enrollments.length}</p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Tests Completed</p>
              <p className="text-2xl font-bold text-white">{user.testAssignments.length}</p>
            </div>
          </div>
        </div>

        {/* Bio/About */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">About Me</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Passionate learner currently enrolled in the Training Compiler platform. Focused on mastering Data Structures and Algorithms, and building full-stack applications.
          </p>

          <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["JavaScript", "TypeScript", "Python", "React", "Node.js", "SQL"].map(skill => (
              <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
