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
    const { name } = req.body;
    const userId = req.user.userId; // Get user ID from authentication middleware
    console.log(userId);
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workout plan name is required.",
      });
    }

    // Create the workout plan for the logged-in user
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name,
        createdByAdmin: false, // User-created
        assignedToUserId: userId, // Assigned to logged-in user
      },
    });

    res.status(201).json({
      success: true,
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

    // Fetch user role
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

    // Fetch ONLY workout plans created by userId
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


const addExerciseToWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exercises } = req.body;

    if (!Array.isArray(exercises)) {
      return res.status(400).json({
        error: "exercises must be an array of objects with exerciseId and sets.",
      });
    }

    // Validate all exercise IDs
    const validExerciseIds = exercises.map((exercise) => exercise.exerciseId);

    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: validExerciseIds } },
      select: { id: true },
    });

    const existingExerciseIds = existingExercises.map((exercise) => exercise.id);

    // Check for invalid exercise IDs
    const invalidIds = validExerciseIds.filter((id) => !existingExerciseIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: `Invalid exerciseId(s): ${invalidIds.join(", ")}`,
      });
    }

    // Process each exercise
    const workoutPlanExercises = await Promise.all(
      exercises.map(async ({ exerciseId, sets }) => {
        // Create WorkoutPlanExercise entry
        const workoutPlanExercise = await prisma.workoutPlanExercise.create({
          data: { workoutPlanId, exerciseId },
        });

        // Default to one set if none provided
        let setData = [{ reps: null, weight: null }];
        if (Array.isArray(sets) && sets.length > 0) {
          setData = sets.map((set) => ({
            reps: set.reps ?? null,
            weight: set.weight ?? null,
          }));
        }

        // Add sets to the newly created workoutPlanExercise
        const createdSets = await Promise.all(
          setData.map((set) =>
            prisma.workoutSet.create({
              data: {
                workoutPlanExerciseId: workoutPlanExercise.id,
                reps: set.reps,
                weight: set.weight,
              },
            })
          )
        );

        return { workoutPlanExercise, sets: createdSets };
      })
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
const deleteWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId } = req.params;
    const { userId, userRole } = req.body; // Receive user ID & role from frontend

    if (!workoutPlanId || !userId) {
      return res.status(400).json({ success: false, message: "Workout Plan ID and User ID are required." });
    }

    const planId = parseInt(workoutPlanId);
    if (isNaN(planId)) {
      return res.status(400).json({ success: false, message: "Invalid Workout Plan ID." });
    }

    // Fetch the workout plan
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: planId },
    });

    if (!workoutPlan) {
      return res.status(404).json({ success: false, message: "Workout Plan not found." });
    }

    // ✅ Permission Check:
    if (userRole !== "admin" && workoutPlan.assignedToUserId !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "You do not have permission to delete this workout plan." });
    }

    // ✅ Cascade delete handled by Prisma
    await prisma.workoutPlan.delete({
      where: { id: planId },
    });

    res.status(200).json({ success: true, message: "Workout Plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    res.status(500).json({ success: false, message: "Failed to delete workout plan.", error: error.message });
  }
};


module.exports = {
  readExercise,
  createUserWorkoutPlan ,
  getUserWorkoutPlans,
  addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
  deleteWorkoutPlan
};
