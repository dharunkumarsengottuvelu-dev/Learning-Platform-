const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed demo questions...");

  // Get a user to assign as creator
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Demo Admin',
        email: 'demo-admin@example.com',
        role: 'ADMIN'
      }
    });
  }

  // --- Seed Demo Test ---
  const demoTest = await prisma.test.create({
    data: {
      title: 'Data Structures Fundamentals',
      description: 'A comprehensive test covering arrays, strings, and hash maps.',
      type: 'MIXED',
      duration: 60,
      totalMarks: 50,
      passingMarks: 20,
      status: 'ACTIVE',
      createdBy: admin.id,
      questions: {
        create: [
          {
            title: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
            type: 'SINGLE_CHOICE',
            options: JSON.stringify(['O(1)', 'O(log n)', 'O(n)', 'O(n^2)']),
            correctAnswer: JSON.stringify(['O(log n)']),
            marks: 2,
            order: 0
          },
          {
            title: 'Which of the following data structures operates on a Last In First Out (LIFO) principle?',
            type: 'SINGLE_CHOICE',
            options: JSON.stringify(['Queue', 'Stack', 'Linked List', 'Array']),
            correctAnswer: JSON.stringify(['Stack']),
            marks: 2,
            order: 1
          },
          {
            title: 'Select all the dynamic data structures from the given options:',
            type: 'MULTIPLE_CHOICE',
            options: JSON.stringify(['Arrays in C', 'Linked Lists', 'Trees', 'Graphs']),
            correctAnswer: JSON.stringify(['Linked Lists', 'Trees', 'Graphs']),
            marks: 4,
            order: 2
          }
        ]
      }
    }
  });

  console.log(`Created Test: ${demoTest.title} (ID: ${demoTest.id})`);

  // --- Seed Demo Coding Problems ---
  const problem1 = await prisma.codingProblem.create({
    data: {
      title: 'Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficulty: 'EASY',
      marks: 10,
      timeLimit: 2,
      enabledLanguages: JSON.stringify(["javascript", "python", "java", "cpp"]),
      testId: demoTest.id,
      testCases: {
        create: [
          { input: '[2,7,11,15]\n9', output: '[0,1]', isHidden: false, order: 0 },
          { input: '[3,2,4]\n6', output: '[1,2]', isHidden: false, order: 1 },
          { input: '[3,3]\n6', output: '[0,1]', isHidden: true, order: 2 }
        ]
      }
    }
  });
  console.log(`Created Problem: ${problem1.title}`);

  const problem2 = await prisma.codingProblem.create({
    data: {
      title: 'Reverse Linked List',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nInput format: A space-separated list of integers representing the linked list.\nOutput format: A space-separated list of integers representing the reversed linked list.',
      difficulty: 'EASY',
      marks: 10,
      timeLimit: 2,
      enabledLanguages: JSON.stringify(["javascript", "python", "java", "cpp", "c"]),
      testCases: {
        create: [
          { input: '1 2 3 4 5', output: '5 4 3 2 1', isHidden: false, order: 0 },
          { input: '1 2', output: '2 1', isHidden: false, order: 1 },
          { input: '[]', output: '[]', isHidden: true, order: 2 }
        ]
      }
    }
  });
  console.log(`Created Problem: ${problem2.title}`);

  const problem3 = await prisma.codingProblem.create({
    data: {
      title: 'Longest Palindromic Substring',
      description: 'Given a string `s`, return the longest palindromic substring in `s`.\n\nExample 1:\nInput: s = "babad"\nOutput: "bab" (or "aba")\n\nConstraints:\n- 1 <= s.length <= 1000\n- s consist of only digits and English letters.',
      difficulty: 'MEDIUM',
      marks: 20,
      timeLimit: 3,
      enabledLanguages: JSON.stringify(["javascript", "python", "cpp", "java"]),
      testCases: {
        create: [
          { input: 'babad', output: 'bab', isHidden: false, order: 0 },
          { input: 'cbbd', output: 'bb', isHidden: false, order: 1 },
          { input: 'a', output: 'a', isHidden: true, order: 2 },
          { input: 'ac', output: 'a', isHidden: true, order: 3 }
        ]
      }
    }
  });
  console.log(`Created Problem: ${problem3.title}`);

  console.log("Successfully seeded demo data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
