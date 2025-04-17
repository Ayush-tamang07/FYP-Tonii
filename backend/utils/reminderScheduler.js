// utils/reminderScheduler.js
const cron = require("node-cron");
const prisma = require("../utils/PrismaClient.js");

const startReminderScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const dueReminders = await prisma.notification.findMany({
      where: {
        scheduledAt: {
          lte: new Date(),
        },
        isSent: false,
      },
    });

    for (const reminder of dueReminders) {
      // TODO: Trigger push, email, or socket notification here

      await prisma.notification.update({
        where: { id: reminder.id },
        data: { isSent: true },
      });
    }
  });

  console.log("🔔 Reminder scheduler started...");
};

module.exports = startReminderScheduler;
