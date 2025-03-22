const prisma = require("../utils/PrismaClient.js");

const addFeedback = async (req, res) => {
    try {
      const { feedback_type, description } = req.body;
      const { userId } = req.params;  
  
      if (!feedback_type || !description || !userId) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const feedback = await prisma.feedback.create({
        data: {
          feedback_type,
          description,
          userId: parseInt(userId),  
        },
      });
  
      return res.status(201).json({ message: "Feedback submitted successfully.", feedback });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  

module.exports = {
  addFeedback,
};
