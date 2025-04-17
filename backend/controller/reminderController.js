const prisma = require("../utils/PrismaClient.js");

const createReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { scheduledAt } = req.body;
    console.log(req.body)

    if (!userId || !scheduledAt) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = await prisma.notification.create({
      data: {
        userId,
        message:`Time to workout`,
        scheduledAt: new Date(scheduledAt),
      },
    });

    return res.status(201).json({ message: "Reminder created", reminder });
  } catch (err) {
    console.error("Failed to create reminder:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getReminders = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const reminders = await prisma.notification.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'asc' }, // Optional: order by time
    });

    return res.status(200).json({ message: "Reminders fetched", reminders });
  } catch (err) {
    console.error("Failed to fetch reminders:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateReminder = async(req,res)=>{
    
}

module.exports = { createReminder, getReminders };
