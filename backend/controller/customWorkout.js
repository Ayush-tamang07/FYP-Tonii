const prisma = require("../utils/PrismaClient.js");

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
    const { userId, name } = req.body;

    const workoutPlan = await prisma.workoutPlan.create({
      data: { name, userId },
    });

    res.status(201).json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
const getWorkoutPlans = async (req, res) => {
  try {
    const { userId } = req.params;

    const workoutPlans = await prisma.workoutPlan.findMany({
      where: { userId: parseInt(userId) },
      include: { exercises: { include: { exercise: true } } },
    });

    res.status(200).json(workoutPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const workoutPlan = await prisma.workoutPlan.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workoutPlan.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const removeExerciseFromWorkoutPlan = async (req, res) => {
  try {
    const { workoutPlanId, exerciseId } = req.body;

    await prisma.workoutPlanExercise.deleteMany({
      where: { workoutPlanId, exerciseId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
  
  


module.exports = {
  readExercise,
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
};
