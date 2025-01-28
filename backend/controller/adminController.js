const prisma = require("../utils/PrismaClient.js");

const addExercise = async (req, res) => {
  try {
    const { name, type, muscle, equipment, difficulty, instructions } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !type ||
      !muscle ||
      !equipment ||
      !difficulty ||
      !instructions
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Check if the exercise already exists
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        name: name,
        muscle: muscle,
        equipment: equipment,
      },
    });

    if (existingExercise) {
      return res.status(409).json({
        success: false,
        message:
          "An exercise with the same name, muscle, and equipment already exists.",
      });
    }

    // Add the new exercise
    const newExercise = await prisma.exercise.create({
      data: {
        name,
        type,
        muscle,
        equipment,
        difficulty,
        instructions,
      },
    });

    res
      .status(201)
      .json({
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

    res
      .status(200)
      .json({
        success: true,
        message: "Exercise deleted successfully.",
        data: exercise,
      });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete exercise.",
        error: error.message,
      });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { id } = req.params; // Get exercise ID from URL parameters
    const { name, type, muscle, equipment, difficulty, instructions } = req.body;

    // Validate that an ID is provided
    if (!id) {
      return res.status(400).json({ success: false, message: "Exercise ID is required." });
    }

    // Validate at least one field to update
    if (!name && !type && !muscle && !equipment && !difficulty && !instructions) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update.",
      });
    }

    // Find the existing exercise
    const existingExercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) }, // Ensure ID is an integer
    });

    if (!existingExercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
      });
    }

    // Update the exercise
    const updatedExercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(muscle && { muscle }),
        ...(equipment && { equipment }),
        ...(difficulty && { difficulty }),
        ...(instructions && { instructions }),
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

const readUser = async (req, res) => {
  try {
    // Fetch all user details from the database
    const userDetails = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        weight: true,
        age: true,
        height: true,
        gender: true,
      },
    });

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};



module.exports = {
  addExercise,
  deleteExercise,
  readUser,
  updateExercise
};
