const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.codingProblem.findFirst();
  console.log("PROBLEM:");
  console.log(p);
  console.log("LANGUAGES:");
  console.log(p?.enabledLanguages);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
