import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      isVerified: true,
      createdAt: true
    }
  });

  console.log("--- All Registered Users ---");
  if (users.length === 0) {
    console.log("No users found in the database.");
  } else {
    users.forEach(u => {
      console.log(`[${u.id}] ${u.username} (${u.email}) - Verified: ${u.isVerified} - CreatedAt: ${u.createdAt}`);
    });
  }
}

listUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
