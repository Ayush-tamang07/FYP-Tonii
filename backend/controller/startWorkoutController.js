const prisma = require("../utils/PrismaClient.js");
const getUserProgress = async (req, res) => {
    
    try {
      const userId  = req.user.userId;
  
      const progress = await prisma.workoutProgress.findMany({
        where: { userId },
        select: { completedAt: true }, // Get only completedAt dates
      });
  
      res.status(200).json({ success: true, progress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  module.exports = {
    getUserProgress,
  };