const express = require('express');
const { userRegister, loginUser} = require('../controller/authController');
const { calculate } = require('../controller/calculator');
const { readExercise, createWorkoutPlan, getUserWorkoutPlans, addExerciseToWorkoutPlan, removeExerciseFromWorkoutPlan } = require('../controller/customWorkout');
const { addExercise } = require('../controller/adminController');

const router = express.Router();

// Authentication routes
router.post("/register", userRegister)
router.post("/login", loginUser)

router.post("/calculate", calculate)

router.get('/exercise',readExercise)
router.post('/workout-plans', createWorkoutPlan);  // Create workout plan
router.get('/workout-plans/:userId', getUserWorkoutPlans);  // Get workout plans for a user
router.post('/workout-plans/add-exercise', addExerciseToWorkoutPlan);  // Add exercise to workout plan
router.post('/workout-plans/remove-exercise', removeExerciseFromWorkoutPlan); 


// Admin
router.post("/addExercise", addExercise); // Add a new exercise
module.exports = router;