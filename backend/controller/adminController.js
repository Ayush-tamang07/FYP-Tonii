const prisma = require("../utils/PrismaClient.js");

const addExercise = async (req, res) => {
  try {
    const {
      name,
      type,
      muscle,
      equipment,
      difficulty,
      instructions,
      category,
      videoUrl,
    } = req.body;
// console.log(req.body)
    if (
      !name ||
      !type ||
      !muscle ||
      !equipment ||
      !difficulty ||
      !instructions ||
      !category ||
      !videoUrl
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        name: name,
        muscle: muscle,
        equipment: equipment,
        category: category,
      },
    });

    if (existingExercise) {
      return res.status(409).json({
        success: false,
        message:
          "An exercise with the same name, muscle, and equipment already exists.",
      });
    }

    const newExercise = await prisma.exercise.create({
      data: {
        name,
        type,
        muscle,
        equipment,
        difficulty,
        category,
        instructions,
        videoUrl
      },
    });

    res.status(201).json({
      success: true,
      message: "Exercise added successfully.",
      data: newExercise,
    });
  } catch (error) {
    console.error("Error adding exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add exercise.",
      error: error.message,
    });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully.",
      data: exercise,
    });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exercise.",
      error: error.message,
    });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      name,
      type,
      muscle,
      equipment,
      difficulty,
      instructions,
      category,
      videoUrl
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Exercise ID is required." });
    }

    if (
      !name &&
      !type &&
      !muscle &&
      !equipment &&
      !difficulty &&
      !category &&
      !instructions&&
      !videoUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update.",
      });
    }

    const existingExercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) }, 
    });

    if (!existingExercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
      });
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(muscle && { muscle }),
        ...(equipment && { equipment }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
        ...(instructions && { instructions }),
        ...(videoUrl && { videoUrl }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully.",
      data: updatedExercise,
    });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update exercise.",
      error: error.message,
    });
  }
};

const readFeedback = async (req, res) => {
  try {
    const { feedback_type, date } = req.query; 

    const filterCondition = {};

    if (feedback_type) {
      filterCondition.feedback_type = feedback_type; 
    }

    if (date) {
      filterCondition.createdAt = {
        gte: new Date(date + "T00:00:00.000Z"), 
        lt: new Date(date + "T23:59:59.999Z"), 
      };
    }

    const feedback = await prisma.feedback.findMany({
      where: filterCondition,
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const createAdminWorkoutPlan  = async (req, res) => {
  try {
    const { name } = req.body;

    const workoutPlan = await prisma.WorkoutPlan.create({
      data: {
        name,
        createdByAdmin: true, 
      },
    });

    res.status(201).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    console.error("Error creating workout plan:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAdminWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        createdByAdmin: true,
        OR: [
          { assignedToUserId: null }, 
          { assignedToUserId: { not: null } } 
        ]
      },
    });
    
    res.status(200).json({ success: true, data: workoutPlans });
  } catch (error) {
    console.error("Error fetching admin workout plans:", error);
    res.status(500).json({ message: "Failed to fetch workout plans" });
  }  
};
const readUserDetailsByAdmin = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user", 
      },
      select: {
        id: true,
        username: true,
        email: true,
        weight: true,
        dob: true,
        height: true,
        gender: true,
        role: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
};

const getDailyActiveUsers = async (req, res) => {
  try {
    const dauData = await prisma.$queryRaw`
      SELECT 
        DATE(completedAt) AS date,
        COUNT(DISTINCT userId) AS count
      FROM workoutProgress
      GROUP BY DATE(completedAt)
      ORDER BY DATE(completedAt) ASC
    `;

    // Convert BigInt to Number
    const formatted = dauData.map(row => ({
      date: row.date,
      count: Number(row.count),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching DAU:", error);
    res.status(500).json({ error: "Failed to get Daily Active Users" });
  }
};


module.exports = {
  addExercise,
  deleteExercise,
  updateExercise,
  readFeedback,
  createAdminWorkoutPlan,
  getAdminWorkoutPlans,
  readUserDetailsByAdmin,
  getDailyActiveUsers
};
