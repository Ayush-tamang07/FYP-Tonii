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

const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from request parameters
    const { username, email, weight, age, height, gender, password } = req.body;

    // ✅ Validate if ID exists and convert it to an integer
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const userId = parseInt(id, 10); // Convert to integer

    // ✅ Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Ensure it's an integer
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Check if the email is being updated and already exists
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists." });
      }
    }

    // ✅ Hash the new password if provided
    let hashedPassword = user.password; // Keep old password if no new one is provided
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // ✅ Update user details
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Ensure it's an integer
      data: {
        username: username || user.username,
        email: email || user.email,
        weight: weight ? parseFloat(weight) : user.weight,
        age: age ? parseInt(age) : user.age,
        height: height ? parseFloat(height) : user.height,
        gender: gender || user.gender,
        password: hashedPassword,
      },
    });

    console.log("User updated:", updatedUser);
    return res.status(200).json({ message: "User details updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Failed to update user details" });
  }
};


const logout = async (req, res) => {
    const authorizationHeaderValue = req.headers["authorization"];
  
  if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
    return res.status(400).json({ error: "No token provided" });
  }

  const token = authorizationHeaderValue.split("Bearer ")[1];

  blacklistedTokens.push(token); // Blacklist the token

  res.json({ message: "Logged out successfully" });
}

module.exports = {
  userRegister,
  loginUser,
  resetPassword,
  loginAdmin,
  updateUserDetails,
  logout
};
