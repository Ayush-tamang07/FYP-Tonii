// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const prisma = require("../utils/PrismaClient.js");

// const readExercise = async (req, res) => {
//   try {
//     // Extract query parameters
//     const { type, muscle, equipment, difficulty } = req.query;

//     // Build dynamic filter object
//     const filters = {};
//     if (type) filters.type = type;
//     if (muscle) filters.muscle = muscle;
//     if (equipment) filters.equipment = equipment;
//     if (difficulty) filters.difficulty = difficulty;

//     // Fetch exercises based on filters
//     const exercises = await prisma.exercise.findMany({
//       where: filters,
//     });

//     // Handle no results
//     if (exercises.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No exercises found matching the given criteria.",
//       });
//     }

//     // Send response with count and exercises
//     res.status(200).json({
//       success: true,
//       count: exercises.length, // Include count of results
//       data: exercises,
//     });
//   } catch (error) {
//     console.error("Error reading exercises:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch exercises from the database.",
//       error: error.message,
//     });
//   }
// };
const readExercise = async (req, res) => {
    try {
      // Extract query parameters
      const { equipment, muscle } = req.query;
  
      // Initialize a filter object
      const filters = {};
  
      // Add filters based on the query parameters
      if (equipment && muscle) {
        // If both equipment and muscle are provided, filter by both
        filters.equipment = equipment;
        filters.muscle = muscle;
      } else if (equipment) {
        // If only equipment is provided, filter by equipment
        filters.equipment = equipment;
      } else if (muscle) {
        // If only muscle is provided, filter by muscle
        filters.muscle = muscle;
      }
  
      // Fetch exercises from the database based on the dynamic filters
      const exercises = await prisma.exercise.findMany({
        where: filters,
      });
  
      // Handle no results
      if (exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No exercises found matching the given criteria.",
        });
      }
  
      // Send response with count and exercises
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
  
  
  

const createWorkoutPlan = async (req, res) => {
  try {
    const { name, userId, exerciseIds } = req.body;

    // Create the workout plan
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json({
      success: true,
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

// Get all workout plans for a user
const getUserWorkoutPlans = async (req, res) => {
  try {
    const userId = req.params.userId;

    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
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

const addExerciseToWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exerciseId } = req.body;

    if (!Array.isArray(exerciseId)) {
      return res.status(400).json({
        error: "exerciseId must be an array of integers.",
      });
    }

    // Validate all exercise IDs
    const validExercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseId },
      },
      select: { id: true },
    });

    const validExerciseIds = validExercises.map((exercise) => exercise.id);

    // Check if any invalid IDs exist
    const invalidIds = exerciseId.filter((id) => !validExerciseIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: `Invalid exerciseId(s): ${invalidIds.join(", ")}`,
      });
    }

    // Add valid exercise IDs to the workout plan
    const workoutPlanExercises = await Promise.all(
      validExerciseIds.map((id) =>
        prisma.workoutPlanExercise.create({
          data: { workoutPlanId, exerciseId: id },
        })
      )
    );

    res.status(201).json(workoutPlanExercises);
  } catch (error) {
    console.error("Error adding exercises to workout plan:", error);
    res.status(500).json({ error: error.message });
  }
};


// Remove an exercise from a workout plan
const removeExerciseFromWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exerciseId } = req.body;

    // Remove the exercise from the workout plan
    const workoutPlanExercise = await prisma.workoutPlanExercise.delete({
      where: {
        workoutPlanId_exerciseId: {
          workoutPlanId,
          exerciseId,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: workoutPlanExercise,
    });
  } catch (error) {
    console.error("Error removing exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove exercise from workout plan.",
      error: error.message,
    });
  }
};

module.exports = {
  readExercise,
  createWorkoutPlan,
  getUserWorkoutPlans,
  addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
};
