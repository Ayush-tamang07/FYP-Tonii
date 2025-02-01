const express = require('express');
const authController= require('../controller/authController.js');
const { calculate } = require('../controller/calculator');
const customWorkout = require('../controller/customWorkout.js');
const adminController = require('../controller/adminController.js');
const resetPassword = require('../controller/resetPassword.js');
const userController = require('../controller/useController.js');

const router = express.Router();

// User Authentication routes
router.post("/user/register", authController.userRegister)
router.post("/user/login", authController.loginUser)

// Admin Authentication routes
// router.post("/admin/register", authController.adminRegister)
// router.post("/admin/login", authController.loginAdmin)

// password reset
router.post('/requestOtp',resetPassword.reqOTP)
router.post('/verifyOtp',resetPassword.verifyOTP)
router.post('/resetPassword',resetPassword.resetPassword)

router.post("/calculate", calculate)

router.get('/exercise',customWorkout.readExercise)
router.post('/workout-plans', customWorkout.createWorkoutPlan);  // Create workout plan
router.get('/workout-plans/:userId', customWorkout.getUserWorkoutPlans);  // Get workout plans for a user
router.post('/workout-plans/add-exercise', customWorkout.addExerciseToWorkoutPlan);  // Add exercise to workout plan
router.delete('/workout-plans/remove-exercise', customWorkout.removeExerciseFromWorkoutPlan); 

// User Funciton
router.post('/user/addFeedback', userController.addFeedback)
// Admin Funciton
router.post("/admin/addExercise", adminController.addExercise); // Add a new exercise
router.get("/admin/readUser",adminController.readUser);
router.put("/admin/updateExercise/:id",adminController.updateExercise);
router.delete("/admin/deleteExercise/:id",adminController.deleteExercise);
module.exports = router;