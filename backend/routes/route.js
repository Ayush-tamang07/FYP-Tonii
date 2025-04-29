const express = require('express');
const authController= require('../controller/authController.js');
const { calculate } = require('../controller/calculator');
const customWorkout = require('../controller/customWorkout.js');
const adminController = require('../controller/adminController.js');
const resetPassword = require('../controller/resetPassword.js');
const userController = require('../controller/useController.js');
const suggestionController = require('../controller/suggestionController.js');
const authMiddleware = require('../middleware/authmiddleware.js');
const startWorkoutController = require('../controller/startWorkoutController.js');
const reminder = require('../controller/reminderController');
const upload = userController.upload;  

const router = express.Router();
// const multer = require('multer');

// User Authentication routes
router.post("/auth/register", authController.userRegister) // test done
router.post("/auth/login", authController.loginUser) // test done
router.post("/logout", authController.logout)
// router.put("/user/:id", authController.updateUserDetails)
router.post("/reminders", authMiddleware(),reminder.createReminder);
router.get("/getReminders", authMiddleware(),reminder.getReminders);

// password reset
router.post('/requestOtp',resetPassword.reqOTP)
router.post('/verifyOtp',resetPassword.verifyOTP)
router.post('/resetPassword',resetPassword.resetPassword)



// User Function
router.post('/user/addFeedback', authMiddleware(),userController.addFeedback) // test done
router.post("/calculate", calculate) // test done
router.put("/user/updateUser", authMiddleware(), upload.single("image"), userController.updateUser);

// custom workout plan
router.get('/exercise',customWorkout.readExercise) // in use
router.get('/exercises',customWorkout.readExercises) // not in use
router.post('/user/workout-plans',authMiddleware(), customWorkout.createUserWorkoutPlan); // test done
router.get('/user/workout-plans',authMiddleware(), customWorkout.getUserWorkoutPlans);  // test done
router.get('/user/workout-plan/:planId/exercises', authMiddleware(), customWorkout.getWorkoutPlanExercises); // test done
router.post('/workout-plans/add-exercise',  customWorkout.addExercisesToWorkoutPlan); // in use
router.delete('/workout-plans/remove-exercise', authMiddleware(),customWorkout.removeExerciseFromWorkoutPlan); // don't know if it is in use or not
router.delete('/workout-plans/:workoutPlanId', authMiddleware(), customWorkout.deleteWorkoutPlan); 
router.get("/exercise-details/:id", customWorkout.exerciseDetails);
router.post("/workout-plans/pin", customWorkout.pinWorkoutPlan)
router.put("/user/workout-plan/:id/exercises", authMiddleware(), customWorkout.updateWorkoutPlanExercises); // it is in use

// 
// streak
router.post("/user/finish-workout", authMiddleware(),customWorkout.finishWorkout);
router.get("/user/getProgress", authMiddleware(),startWorkoutController.getUserProgress);

// Admin Function
router.post("/admin/addExercise", adminController.addExercise); // Add a new exercise
router.get("/readUser", authMiddleware(), authController.readUser);
router.get("/admin/readUser", authMiddleware(), adminController.readUserDetailsByAdmin); // in use by admin
router.put("/admin/updateExercise/:id",adminController.updateExercise);
router.delete("/admin/deleteExercise/:id",adminController.deleteExercise);
router.get("/admin/readFeedback",adminController.readFeedback);
router.get("/analytics/dau", adminController.getDailyActiveUsers)
 
// workout plan created by admin
router.post("/admin/workout-plans",adminController.createAdminWorkoutPlan);
router.get("/admin/workout-plans",adminController.getAdminWorkoutPlans);


router.post("/suggestion",suggestionController.suggestion)
module.exports = router;