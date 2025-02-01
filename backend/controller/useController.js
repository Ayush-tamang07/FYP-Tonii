const prisma = require("../utils/PrismaClient.js");

const addFeedback = async (req, res) => {
  try {
    const { feedback_type, description, userId } = req.body;

    // Ensure all required fields are provided
    if (!feedback_type || !description || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create feedback and link to the user by userId
    const feedback = await prisma.feedback.create({
      data: {
        feedback_type,
        description,
        userId,  // Directly use userId to connect to the user
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
