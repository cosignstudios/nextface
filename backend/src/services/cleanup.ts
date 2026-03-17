import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initCleanupTask = () => {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("[Cleanup] Running automated cleanup of unverified accounts...");
    
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const deleted = await prisma.user.deleteMany({
        where: {
          isVerified: false,
          createdAt: {
            lt: thirtyMinutesAgo,
          },
        },
      });
      
      if (deleted.count > 0) {
        console.log(`[Cleanup] Successfully deleted ${deleted.count} unverified accounts.`);
      } else {
        console.log("[Cleanup] No expired unverified accounts found.");
      }
    } catch (error) {
      console.error("[Cleanup] Error during automated cleanup:", error);
    }
  });
  
  console.log("[Cleanup] Automated cleanup task scheduled (every 15 minutes).");
};
