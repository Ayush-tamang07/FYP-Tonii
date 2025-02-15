// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const prisma = require("../utils/PrismaClient.js");

const readExercise = async (req, res) => {
  try {
    // Extract query parameters
    const { equipment, category } = req.query;

    // Initialize a filter object
    const filters = {};

    // Add filters based on the query parameters
    if (equipment && category) {
      // If both equipment and category are provided, filter by both
      filters.equipment = equipment;
      filters.category = category;
    } else if (equipment) {
      // If only equipment is provided, filter by equipment
      filters.equipment = equipment;
    } else if (category) {
      // If only category is provided, filter by category
      filters.category = category;
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

const createUserWorkoutPlan = async (req, res) => {
  try {
    const { name, userId } = req.body;

    // Create the workout plan for a specific user
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name,
        createdByAdmin: false, // User-created
        assignedToUserId: userId, // Specific to the user
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


const getUserWorkoutPlans = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Get the count of workout plans (both admin-created and user-specific)
    const workoutPlanCount = await prisma.workoutPlan.count({
      where: {
        OR: [
          { createdByAdmin: true }, // Global admin plans
          { assignedToUserId: userId }, // User-specific plans
        ],
      },
    });

    // Fetch the actual workout plans with exercises
    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        OR: [
          { createdByAdmin: true }, // Global admin plans
          { assignedToUserId: userId }, // User-specific plans
        ],
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (workoutPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No workout plans found for this user.",
        count: workoutPlanCount, // Return count even if it's 0
      });
    }

    res.status(200).json({
      success: true,
      count: workoutPlanCount, // Include the count in the response
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
    const invalidIds = exerciseId.filter(
      (id) => !validExerciseIds.includes(id)
    );
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
// const removeExerciseFromWorkoutPlan = async (req, res) => {
//   try {
//     const { workoutPlanId, exerciseId } = req.body;

//     // Remove the exercise from the workout plan
//     const workoutPlanExercise = await prisma.workoutPlanExercise.delete({
//       where: {
//         workoutPlanId_exerciseId: {
//           workoutPlanId,
//           exerciseId,
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       data: workoutPlanExercise,
//     });
//   } catch (error) {
//     console.error("Error removing exercise:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to remove exercise from workout plan.",
//       error: error.message,
//     });
//   }
// };
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

    // Validate that exercises exist in the database
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

    // Remove all valid exercises from the workout plan
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

module.exports = {
  readExercise,
  createUserWorkoutPlan ,
  getUserWorkoutPlans,
  addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
};
