// const { join } = require("@prisma/client/runtime/library");
const prisma = require("../utils/PrismaClient.js");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { username, email, weight, age, height, gender, password } = req.body;

    // ✅ Check if all required fields are provided
    if (!username || !email || !age || !weight || !height || !gender || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." }); // 409 Conflict
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        weight: parseFloat(weight),
        age: parseInt(age),
        height: parseFloat(height),
        gender,
        password: hashedPassword,
        role: "user",
      },
    });

    console.log("User registered:", newUser);
    return res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

module.exports = { userRegister };


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
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email }, // Payload
    //   process.env.JWT_SECRET, // Secret key
    //   { expiresIn: "1h" } // Token expiration time
    // );
    return res.status(200).json({
      message: "Login Successfully",
      user,
      // token,
    });
    // return res.status(200).json({ message: "Login Successfully", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "failed to login" });
  }
};

const showUser = async (req, res) => {
  try {
    // const {username, email, }
  } catch (error) {}
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
  } catch (error) {}
};

// admin authentication
const loginAdmin = async (req, res) => {
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
    // checking admin
    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }
    // Checking if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Compare the provided password with the hashed password stored in the database
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    return res.status(200).json({
      message: "Login Successfully",
      user,
      // token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "failed to login" });
  }
};

module.exports = {
  userRegister,
  loginUser,
  resetPassword,
  loginAdmin
};
