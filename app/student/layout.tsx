import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const role = (session.user as any)?.role;
  if (role !== "STUDENT") redirect("/admin/dashboard");

  return (
    <div className="flex h-screen bg-[#0a0a1a] overflow-hidden">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
