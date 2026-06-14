import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

async function getDashboardStats() {
  const [
    totalStudents, totalCourses, totalTests, totalSubmissions,
    recentSubmissions, activeTestsCount, pendingSubmissions, draftCourses
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.course.count(),
    db.test.count(),
    db.submission.count(),
    db.submission.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { student: { select: { name: true, email: true } }, problem: { select: { title: true } } },
    }),
    db.test.count({ where: { status: "ACTIVE" } }),
    db.submission.count({ where: { status: "PENDING" } }),
    db.course.count({ where: { status: "DRAFT" } }),
  ]);

  // Monthly enrollment data (last 6 months)
  const monthlyData = await db.enrollment.groupBy({
    by: ["enrolledAt"],
    _count: true,
    orderBy: { enrolledAt: "asc" },
    take: 180,
  });

  return {
    totalStudents, totalCourses, totalTests, totalSubmissions,
    recentSubmissions, activeTests: activeTestsCount, pendingSubmissions, draftCourses,
    monthlyData
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();
  return <DashboardClient stats={stats} user={session?.user as any} />;
}
