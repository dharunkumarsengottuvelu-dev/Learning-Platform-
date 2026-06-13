import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentNavbar from "@/components/student/StudentNavbar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const role = (session.user as any)?.role;
  if (role !== "STUDENT") redirect("/admin/dashboard");

  return (
    <div className="flex flex-col h-screen bg-[#0a0a1a] overflow-hidden">
      <StudentNavbar user={session.user as any} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
