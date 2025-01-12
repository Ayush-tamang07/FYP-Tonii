const express = require('express');
const authController= require('../controller/authController.js');
const { calculate } = require('../controller/calculator');
const customWorkout = require('../controller/customWorkout.js');
const adminController = require('../controller/adminController.js');

const router = express.Router();

// Authentication routes
router.post("/user/register", authController.userRegister)
router.post("/user/login", authController.loginUser)

router.post("/calculate", calculate)

router.get('/exercise',customWorkout.readExercise)
router.post('/workout-plans', customWorkout.createWorkoutPlan);  // Create workout plan
router.get('/workout-plans/:userId', customWorkout.getUserWorkoutPlans);  // Get workout plans for a user
router.post('/workout-plans/add-exercise', customWorkout.addExerciseToWorkoutPlan);  // Add exercise to workout plan
router.post('/workout-plans/remove-exercise', customWorkout.removeExerciseFromWorkoutPlan); 


// Admin
router.post("/addExercise", adminController.addExercise); // Add a new exercise
module.exports = router;