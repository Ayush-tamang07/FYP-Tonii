const prisma = require("../utils/PrismaClient.js");

const addExercise = async (req, res) => {
    try {
      const { name, type, muscle, equipment, difficulty, instructions, id } = req.body;
  
      // Validate required fields
      if (!name || !type || !muscle || !equipment || !difficulty || !instructions) {
        return res.status(400).json({ success: false, message: "All fields are required." });
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
          message: "An exercise with the same name, muscle, and equipment already exists.",
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
  
      res.status(201).json({ success: true, message: "Exercise added successfully.", data: newExercise });
    } catch (error) {
      console.error("Error adding exercise:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add exercise.",
        error: error.message,
      });
    }
  };
  

//   const deleteExercise = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const exercise = await prisma.exercise.delete({ where: { id: parseInt(id, 10) } });
  
//       res.status(200).json({ success: true, message: "Exercise deleted successfully.", data: exercise });
//     } catch (error) {
//       console.error("Error deleting exercise:", error);
//       res.status(500).json({ success: false, message: "Failed to delete exercise.", error: error.message });
//     }
//   };


  module.exports = {
    addExercise,
    // deleteExercise
  };