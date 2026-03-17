import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearUser() {
  const email = 'alex46nicko@gmail.com';
  const username = 'mrx';
  
  const result = await prisma.user.deleteMany({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  console.log(`CLEANUP_RESULT: Deleted ${result.count} blocking records.`);
}

clearUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
