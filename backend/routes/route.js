const express = require('express');
const { userRegister, loginUser} = require('../controller/authController');
const { calculate } = require('../controller/calculator');

const router = express.Router();

// Authentication routes
router.post("/register", userRegister)
router.post("/login", loginUser)



router.post("/calculate", calculate)

 

module.exports = router;