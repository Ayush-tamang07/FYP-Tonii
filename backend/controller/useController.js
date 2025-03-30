const prisma = require("../utils/PrismaClient.js");
const cloudinary = require("../configs/cloudinary");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const   updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, dob, gender,height, weight } = req.body;
    console.log(req.body)

    const user = await prisma.user.findFirst({
      where:{
        id: userId,
      }
    })
   
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload to Cloudinary
      cloudinary.uploader
        .upload_stream({ folder: "uploads" }, async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Upload to Cloudinary failed" });
          }
  
          const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
              username: name,
              email: email ?email : user.email,
              image: result.secure_url,
              weight: weight,
              dob:new Date(dob),
              gender:gender,
              height: parseInt(height)
            },
          });
  
          res.json({
            message: "user updated successful",
            updateUser
          });
        })
        .end(req.file.buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  const addFeedback = async (req, res) => {
    try {
        const { feedback_type, description } = req.body;
        const userId = req.user.userId;  
        // console.log(req.body);
  
        if (!feedback_type || !description || !userId) {
            return res.status(400).json({ message: "All fields are required." });
        }
  
        const feedback = await prisma.feedback.create({
            data: {
                feedback_type,
                description,
                userId,
            },
        });
        
        return res.status(201).json({ message: "Feedback submitted successfully.", feedback });
    } catch (error) {
        console.error("Error submitting feedback:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
  };
  

module.exports = {
  addFeedback,
  upload,
  updateUser
};
