// const { join } = require("@prisma/client/runtime/library");
const prisma = require("../utils/PrismaClient.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { username, email, weight, dob, height, gender, password, confirmPassword } = req.body;

    // ✅ Check if all required fields are provided
    if (!username || !email || !dob || !weight || !height || !gender || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // ✅ Convert DOB to Age
    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        weight: parseFloat(weight),
        dob: dob,
        height: parseFloat(height),
        gender,
        password: hashedPassword,
        role: "user",
      },
    });

    // console.log("User registered:", newUser);
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
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    
  

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User login successful",
      token,
      role:user.role
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

// const updateUserDetails = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const { username, email, weight, age, height, gender, password } = req.body;

//     if (!id) {
//       return res.status(400).json({ error: "User ID is required." });
//     }
//     const userId = parseInt(id, 10); 

//     const user = await prisma.user.findUnique({
//       where: { id: userId }, 
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     if (email && email !== user.email) {
//       const existingUser = await prisma.user.findUnique({ where: { email } });
//       if (existingUser) {
//         return res.status(409).json({ error: "Email already exists." });
//       }
//     }

//     let hashedPassword = user.password;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         username: username || user.username,
//         email: email || user.email,
//         weight: weight ? parseFloat(weight) : user.weight,
//         age: age ? parseInt(age) : user.age,
//         height: height ? parseFloat(height) : user.height,
//         gender: gender || user.gender,
//         password: hashedPassword,
//       },
//     });

//     console.log("User updated:", updatedUser);
//     return res
//       .status(200)
//       .json({
//         message: "User details updated successfully",
//         user: updatedUser,
//       });
//   } catch (error) {
//     console.error("Update error:", error);
//     return res.status(500).json({ error: "Failed to update user details" });
//   }
// };

const logout = async (req, res) => {
  const authorizationHeaderValue = req.headers["authorization"];

  if (
    !authorizationHeaderValue ||
    !authorizationHeaderValue.startsWith("Bearer ")
  ) {
    return res.status(400).json({ error: "No token provided" });
  }

  const token = authorizationHeaderValue.split("Bearer ")[1];

  blacklistedTokens.push(token); 

  res.json({ message: "Logged out successfully" });
};

const readUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userDetails = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        weight: true,
        dob: true,
        height: true,
        gender: true,
        image: true,
      },
    });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  userRegister,
  loginUser,
  // loginAdmin,
  // updateUserDetails,
  logout,
  readUser,
};
