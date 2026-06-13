import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash("Admin@123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@tc.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@tc.com",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Super Admin:", superAdmin.email);

  // Create Admin
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tc.com" },
    update: {},
    create: {
      name: "Training Admin",
      email: "admin@tc.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin:", admin.email);

  // Create Students
  const studentPassword = await bcrypt.hash("Student@123", 12);
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: "student1@tc.com" },
      update: {},
      create: {
        name: "Arjun Kumar",
        email: "student1@tc.com",
        password: studentPassword,
        role: "STUDENT",
        college: "Anna University",
        department: "Computer Science",
        year: "3rd Year",
        phone: "+91 9876543210",
      },
    }),
    prisma.user.upsert({
      where: { email: "student2@tc.com" },
      update: {},
      create: {
        name: "Priya Sharma",
        email: "student2@tc.com",
        password: studentPassword,
        role: "STUDENT",
        college: "VIT Chennai",
        department: "Information Technology",
        year: "2nd Year",
        phone: "+91 9876543211",
      },
    }),
    prisma.user.upsert({
      where: { email: "student3@tc.com" },
      update: {},
      create: {
        name: "Dharun Kumar",
        email: "student3@tc.com",
        password: studentPassword,
        role: "STUDENT",
        college: "SRM University",
        department: "CSE",
        year: "4th Year",
        phone: "+91 9876543212",
      },
    }),
  ]);
  console.log("✅ Students created:", students.length);

  // Create Courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course-python" },
      update: {},
      create: {
        id: "course-python",
        title: "Python Full Stack",
        description: "Master Python from basics to advanced web development with Django and FastAPI.",
        difficulty: "MEDIUM",
        duration: "60 hours",
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-mern" },
      update: {},
      create: {
        id: "course-mern",
        title: "MERN Stack Development",
        description: "Complete MERN stack course covering MongoDB, Express, React, and Node.js.",
        difficulty: "HARD",
        duration: "80 hours",
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-dsa" },
      update: {},
      create: {
        id: "course-dsa",
        title: "Data Structures & Algorithms",
        description: "Master DSA with practical problem-solving for technical interviews.",
        difficulty: "HARD",
        duration: "40 hours",
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    }),
    prisma.course.upsert({
      where: { id: "course-aptitude" },
      update: {},
      create: {
        id: "course-aptitude",
        title: "Aptitude & Reasoning",
        description: "Quantitative aptitude, logical reasoning, and verbal ability for placements.",
        difficulty: "EASY",
        duration: "20 hours",
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    }),
  ]);
  console.log("✅ Courses created:", courses.length);

  // Create Test
  const codingTest = await prisma.test.upsert({
    where: { id: "test-dsa-1" },
    update: {},
    create: {
      id: "test-dsa-1",
      title: "DSA Round 1",
      description: "Basic data structures and algorithmic problems",
      type: "CODING",
      duration: 90,
      passingMarks: 40,
      totalMarks: 100,
      status: "ACTIVE",
      createdBy: admin.id,
    },
  });
  console.log("✅ Test created:", codingTest.title);

  // Create Coding Problems
  const problem1 = await prisma.codingProblem.upsert({
    where: { id: "prob-reverse-string" },
    update: {},
    create: {
      id: "prob-reverse-string",
      testId: codingTest.id,
      title: "Reverse a String",
      description: "Given a string, reverse it and print the result.\n\nExample:\nInput: hello\nOutput: olleh",
      difficulty: "EASY",
      constraints: "1 ≤ |s| ≤ 10^5\nString contains only lowercase letters",
      inputFormat: "A single line containing the string s.",
      outputFormat: "Print the reversed string on a single line.",
      sampleInput: "hello",
      sampleOutput: "olleh",
      marks: 10,
      timeLimit: 2,
      memoryLimit: 256,
      enabledLanguages: ["python", "javascript", "java", "cpp", "c"],
    },
  });

  const problem2 = await prisma.codingProblem.upsert({
    where: { id: "prob-two-sum" },
    update: {},
    create: {
      id: "prob-two-sum",
      testId: codingTest.id,
      title: "Two Sum",
      description: "Given an array of integers and a target, find two numbers that add up to the target.\nPrint their 0-based indices separated by a space.\n\nExample:\nInput:\n4 9\n2 7 11 15\nOutput: 0 1",
      difficulty: "MEDIUM",
      constraints: "2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9",
      inputFormat: "Line 1: n and target\nLine 2: n space-separated integers",
      outputFormat: "Two 0-based indices i j where nums[i] + nums[j] = target",
      sampleInput: "4 9\n2 7 11 15",
      sampleOutput: "0 1",
      marks: 20,
      timeLimit: 2,
      memoryLimit: 256,
      enabledLanguages: ["python", "javascript", "java", "cpp", "c", "typescript"],
    },
  });

  const problem3 = await prisma.codingProblem.upsert({
    where: { id: "prob-palindrome" },
    update: {},
    create: {
      id: "prob-palindrome",
      testId: codingTest.id,
      title: "Palindrome Check",
      description: "Check if a given string is a palindrome. Print 'YES' if it is, 'NO' otherwise.\n\nExample:\nInput: racecar\nOutput: YES",
      difficulty: "EASY",
      constraints: "1 ≤ |s| ≤ 10^5",
      inputFormat: "A single string s.",
      outputFormat: "YES or NO",
      sampleInput: "racecar",
      sampleOutput: "YES",
      marks: 10,
      timeLimit: 2,
      memoryLimit: 256,
      enabledLanguages: ["python", "javascript", "java", "cpp", "c"],
    },
  });
  console.log("✅ Coding problems created: 3");

  // Create Test Cases for Problem 1
  await prisma.testCase.deleteMany({ where: { problemId: problem1.id } });
  await prisma.testCase.createMany({
    data: [
      { problemId: problem1.id, input: "hello", output: "olleh", isHidden: false, order: 0 },
      { problemId: problem1.id, input: "world", output: "dlrow", isHidden: false, order: 1 },
      { problemId: problem1.id, input: "abcdefghij", output: "jihgfedcba", isHidden: true, order: 2 },
      { problemId: problem1.id, input: "racecar", output: "racecar", isHidden: true, order: 3 },
    ],
  });

  // Create Test Cases for Problem 2
  await prisma.testCase.deleteMany({ where: { problemId: problem2.id } });
  await prisma.testCase.createMany({
    data: [
      { problemId: problem2.id, input: "4 9\n2 7 11 15", output: "0 1", isHidden: false, order: 0 },
      { problemId: problem2.id, input: "3 6\n3 2 4", output: "1 2", isHidden: false, order: 1 },
      { problemId: problem2.id, input: "2 6\n3 3", output: "0 1", isHidden: true, order: 2 },
    ],
  });

  // Create Test Cases for Problem 3
  await prisma.testCase.deleteMany({ where: { problemId: problem3.id } });
  await prisma.testCase.createMany({
    data: [
      { problemId: problem3.id, input: "racecar", output: "YES", isHidden: false, order: 0 },
      { problemId: problem3.id, input: "hello", output: "NO", isHidden: false, order: 1 },
      { problemId: problem3.id, input: "madam", output: "YES", isHidden: true, order: 2 },
      { problemId: problem3.id, input: "coding", output: "NO", isHidden: true, order: 3 },
    ],
  });
  console.log("✅ Test cases created");

  // Enroll students in courses
  for (const student of students) {
    for (const course of courses.slice(0, 2)) {
      await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
        update: {},
        create: { studentId: student.id, courseId: course.id },
      });
    }
    // Assign test
    await prisma.testAssignment.upsert({
      where: { id: `assign-${student.id}-${codingTest.id}` },
      update: {},
      create: {
        id: `assign-${student.id}-${codingTest.id}`,
        testId: codingTest.id,
        studentId: student.id,
      },
    });
  }
  console.log("✅ Enrollments and assignments created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Super Admin: superadmin@tc.com / Admin@123");
  console.log("   Admin:       admin@tc.com / Admin@123");
  console.log("   Student 1:   student1@tc.com / Student@123");
  console.log("   Student 2:   student2@tc.com / Student@123");
  console.log("   Student 3:   student3@tc.com / Student@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
