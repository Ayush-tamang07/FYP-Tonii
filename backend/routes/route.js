const express = require('express');
const authController= require('../controller/authController.js');
const { calculate } = require('../controller/calculator');
const customWorkout = require('../controller/customWorkout.js');
const adminController = require('../controller/adminController');
const resetPassword = require('../controller/resetPassword.js');

const router = express.Router();

// Authentication routes
router.post("/register", authController.userRegister)
router.post("/login", authController.loginUser)

// reset resetPassword
router.post('/requestOtp',resetPassword.reqOTP)
router.post('/verifyOtp',resetPassword.verifyOTP)
router.post('/resetPassword',resetPassword.resetPassword)

router.post("/calculate", calculate)
router.get('/exercise', customWorkout.readExercise)

// Routes for workout plans
router.post('/createWorkoutPlan', customWorkout.createWorkoutPlan); // test success
router.get('/:userId', customWorkout.getWorkoutPlans);  // test success
router.put('/:id', customWorkout.updateWorkoutPlan);
router.delete('/:id', customWorkout.deleteWorkoutPlan);

// Routes for exercises in workout plans
router.post('/add-exercise', customWorkout.addExerciseToWorkoutPlan);  // test success
router.post('/remove-exercise', customWorkout.removeExerciseFromWorkoutPlan);

// Admin
router.post("/addExercise", adminController.addExercise); // Admin can add new exercise

module.exports = router;