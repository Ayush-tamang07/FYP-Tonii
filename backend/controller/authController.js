// const { join } = require("@prisma/client/runtime/library");
const prisma = require("../prismaClient.js");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { username, email, weight, age, height, gender, password } = req.body;
    if (
      !username ||
      !email ||
      !age ||
      !weight ||
      !height ||
      !gender ||
      !password
    ) {
      return res.status(300).json({ error: "provide all fields" });
    }
    // checking if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const allData = await prisma.user.create({
      data: {
        username: username,
        email: email,
        weight: weight,
        age: age,
        height: height,
        gender: gender,
        password: hashedPassword,
      },
    });
    console.log(allData);

    return res.status(201).json({ message: "user created successfully", allData });
  } catch (error) {
    return res.status(500).json({ error: "failed to register user" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "all field is required" });
    }
    console.log(email);
    console.log(password);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },  
    });

    // checking user
    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }

    // Compare the provided password with the hashed password stored in the database
    const checkPassword = await bcrypt.compare(password, user.password);
    
    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ message: "Login Successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "failed to login" });
  }
};
module.exports = {
  userRegister,
  loginUser,
};
