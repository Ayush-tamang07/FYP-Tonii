const prisma = require("../utils/PrismaClient.js");

const readExercise = async (req, res) => {
  try {
    const { equipment, category } = req.query;

    const filters = {};

    if (equipment && category) {
      filters.equipment = equipment;
      filters.category = category;
    } else if (equipment) {
      filters.equipment = equipment;
    } else if (category) {
      filters.category = category;
    }

    const exercises = await prisma.exercise.findMany({
      where: filters,
    });

    if (exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exercises found matching the given criteria.",
      });
    }

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Error reading exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises from the database.",
      error: error.message,
    });
  }
};

const createUserWorkoutPlan = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workout plan name is required.",
      });
    }

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name,
        createdByAdmin: false,
        assignedToUserId: userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully.",
      data: workoutPlan,
    });
  } catch (error) {
    console.error("Error creating workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workout plan.",
      error: error.message,
    });
  }
};


const getUserWorkoutPlans = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const workoutPlans = await prisma.workoutPlan.findMany({
      where: { assignedToUserId: userId }, // Only fetch plans where the user created them
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    const workoutPlanCount = workoutPlans.length;

    if (workoutPlanCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No workout plans found for this user.",
        count: workoutPlanCount,
      });
    }

    res.status(200).json({
      success: true,
      count: workoutPlanCount,
      data: workoutPlans,
    });
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plans.",
      error: error.message,
    });
  }
};
const getWorkoutPlanExercises = async (req, res) => {
  try {
    const userId = req.user.userId;
    const workoutPlanId = parseInt(req.params.planId);

    if (isNaN(userId) || isNaN(workoutPlanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or workout plan ID.",
      });
    }

    // Verify the workout plan belongs to the user
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: {
        id: workoutPlanId,
        assignedToUserId: userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true, // Include detailed exercise information
          },
        },
      },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found or does not belong to user.",
      });
    }

    res.status(200).json({
      success: true,
      workoutPlanId: workoutPlan.id,
      workoutPlanName: workoutPlan.name,
      exercises: workoutPlan.exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises for workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises for workout plan.",
      error: error.message,
    });
  }
};

const addExercisesToWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exercises } = req.body;

    if (!workoutPlanId || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        error:
          "workoutPlanId is required, and exercises must be a non-empty array of exerciseId.",
      });
    }

    const workoutPlanExists = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
    });

    if (!workoutPlanExists) {
      return res.status(404).json({ error: "Workout Plan not found" });
    }

    const validExerciseIds = exercises;
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: validExerciseIds } },
      select: { id: true },
    });

    const existingExerciseIds = existingExercises.map(
      (exercise) => exercise.id
    );

    const invalidIds = validExerciseIds.filter(
      (id) => !existingExerciseIds.includes(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: `Invalid exerciseId(s): ${invalidIds.join(", ")}`,
      });
    }

    const addedExercises = await prisma.workoutPlanExercise.createMany({
      data: exercises.map((exerciseId) => ({
        workoutPlanId,
        exerciseId,
      })),
    });

    res
      .status(201)
      .json({ message: "Exercises added successfully", addedExercises });
  } catch (error) {
    console.error("Error adding exercises to workout plan:", error);
    res.status(500).json({ error: error.message });
  }
};

const removeExerciseFromWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exerciseIds } = req.body;

    if (!workoutPlanId || !exerciseIds) {
      return res.status(400).json({
        success: false,
        message: "WorkoutPlanId and exerciseIds are required.",
      });
    }

    if (!Array.isArray(exerciseIds)) {
      return res.status(400).json({
        success: false,
        message: "exerciseIds must be an array of integers.",
      });
    }

    const validExercises = await prisma.workoutPlanExercise.findMany({
      where: {
        workoutPlanId,
        exerciseId: { in: exerciseIds },
      },
      select: { id: true },
    });

    const validExerciseIds = validExercises.map((exercise) => exercise.id);

    if (validExerciseIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid exercises found for the given workout plan.",
      });
    }

    const deletionPromises = validExerciseIds.map((id) =>
      prisma.workoutPlanExercise.delete({
        where: {
          id,
        },
      })
    );

    await Promise.all(deletionPromises);

    res.status(200).json({
      success: true,
      message: "Exercises removed successfully from the workout plan.",
    });
  } catch (error) {
    console.error("Error removing exercises from workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove exercises from workout plan.",
      error: error.message,
    });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId } = req.params;
    const { userId, userRole } = req.user; // Extracting from authMiddleware

    if (!workoutPlanId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Workout Plan ID is required.",
        });
    }

    const planId = parseInt(workoutPlanId);
    if (isNaN(planId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Workout Plan ID." });
    }

    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: planId },
    });

    if (!workoutPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Workout Plan not found." });
    }

    if (
      userRole !== "admin" &&
      workoutPlan.assignedToUserId !== userId
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission to delete this workout plan.",
        });
    }

    await prisma.workoutPlan.delete({
      where: { id: planId },
    });

    res
      .status(200)
      .json({ success: true, message: "Workout Plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete workout plan.",
        error: error.message,
      });
  }
};

const createWorkoutPlanWithExercises = async (req, res) => {
  try {
    const { name, exercises } = req.body ;

    const workoutPlan = await prisma.workoutPlan.create({
      data: { name },
    });

    if (Array.isArray(exercises) && exercises.length > 0) {
      await addExerciseToWorkoutPlan({
        ...req,
        body: { workoutPlanId: workoutPlan.id, exercises },
      });
    }

    res.status(201).json({ success: true, data: workoutPlan });
  } catch (error) {
    console.error("Error creating workout plan with exercises:", error);
    res.status(500).json({ error: error.message });
  }
};

const finishWorkout = async (req, res) => {
  try {
    const { userId, workoutPlanId } = req.body; 

    const existingProgress = await prisma.workoutProgress.findFirst({
      where: {
        userId,
        workoutPlanId,
        completedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), 
        },
      },
    });

    if (existingProgress) {
      return res
        .status(400)
        .json({ success: false, message: "Workout already logged today" });
    }

    const progress = await prisma.workoutProgress.create({
      data: {
        userId,
        workoutPlanId,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Workout logged successfully!",
        progress,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const exerciseDetails = async (req, res) => {
  try {
    const { id } = req.params; 

    const exerciseDetailsData = await prisma.exercise.findUnique({
      where: { id: Number(id) }, 
    });

    if (!exerciseDetailsData) {
      return res.status(404).json({ success: false, message: "Exercise not found." });
    }

    res.status(200).json({ 
      success: true, 
      message: "Exercise details fetched successfully.", 
      data: exerciseDetailsData 
    });
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const readExercises = async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany(); 
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error reading exercises:", error);
    res.status(500).json({ message: "Failed to fetch exercises" });
  }
};

const pinWorkoutPlan = async (req, res) => {
  try {
      const { workoutPlanId, pin } = req.body;

      if (workoutPlanId === undefined || pin === undefined) {
          return res.status(400).json({ message: "Workout Plan ID and pin status are required" });
      }

      const updatedWorkout = await prisma.workoutPlan.update({
          where: { id: workoutPlanId },
          data: { isPinned: pin },
      });

      return res.status(200).json({ 
          message: pin ? "Workout plan pinned successfully" : "Workout plan unpinned successfully", 
          workoutPlan: updatedWorkout 
      });
  } catch (error) {
      console.error("Error updating workout plan:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  readExercise,
  createUserWorkoutPlan,
  getUserWorkoutPlans,
  // addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
  deleteWorkoutPlan,
  createWorkoutPlanWithExercises,
  addExercisesToWorkoutPlan,
  getWorkoutPlanExercises,
  finishWorkout,
  exerciseDetails,
  readExercises,
  pinWorkoutPlan
};
