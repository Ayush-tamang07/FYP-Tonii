const express = require('express');
const authController= require('../controller/authController.js');
const { calculate } = require('../controller/calculator');
const customWorkout = require('../controller/customWorkout.js');
const adminController = require('../controller/adminController.js');
const resetPassword = require('../controller/resetPassword.js');
const userController = require('../controller/useController.js');
const authMiddleware = require('../middleware/authmiddleware.js');

const router = express.Router();

// User Authentication routes
router.post("/auth/register", authController.userRegister)
router.post("/auth/login", authController.loginUser)
router.post("/logout", authController.logout)
router.put("/user/:id", authController.updateUserDetails)

// Admin Authentication routes
// router.post("/admin/register", authController.adminRegister)
// router.post("/admin/login", authController.loginAdmin)

// password reset
router.post('/requestOtp',resetPassword.reqOTP)
router.post('/verifyOtp',resetPassword.verifyOTP)
router.post('/resetPassword',resetPassword.resetPassword)

// User Function
router.post('/user/addFeedback/:userId', userController.addFeedback)
router.post("/calculate", calculate)

router.get('/exercise',customWorkout.readExercise)
router.post('/user/workout-plans',authMiddleware(), customWorkout.createUserWorkoutPlan);  // Create workout plan
router.get('/user/workout-plans',authMiddleware(), customWorkout.getUserWorkoutPlans);  // Get user's workout plans
router.post('/workout-plans/add-exercise',  customWorkout.addExerciseToWorkoutPlan);  // Add exercise to workout plan
router.delete('/workout-plans/remove-exercise', customWorkout.removeExerciseFromWorkoutPlan); 
router.delete('/workout-plans/:workoutPlanId', customWorkout.deleteWorkoutPlan); 

// Admin Function
router.post("/admin/addExercise", adminController.addExercise); // Add a new exercise
router.get("/readUser", authMiddleware(), authController.readUser);
router.get("/admin/readUser", authMiddleware(), adminController.readUserDetailsByAdmin);
router.put("/admin/updateExercise/:id",adminController.updateExercise);
router.delete("/admin/deleteExercise/:id",adminController.deleteExercise);
router.get("/admin/readFeedback",adminController.readFeedback);

// workout plan created by admin
router.post("/admin/workout-plans",adminController.createAdminWorkoutPlan);
router.get("/admin/workout-plans",adminController.getAdminWorkoutPlans);

module.exports = router;