const express = require('express');
const { userRegister, loginUser} = require('../controller/authController');
const { calculate } = require('../controller/calculator');
const { readExercise } = require('../controller/customWorkout');

const router = express.Router();

// Authentication routes
router.post("/register", userRegister)
router.post("/login", loginUser)

router.post("/calculate", calculate)

router.get('/exercise',readExercise)

module.exports = router;