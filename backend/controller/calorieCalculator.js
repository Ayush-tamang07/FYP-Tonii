// const { join } = require("@prisma/client/runtime/library");
// const prisma = require("../prismaClient.js");

// const calorieCalculator = async (req, res) => {
//   try{
//     const {height, weight, age, gender, activity, goal} = req.body;
//     if(!height || !weight || !age || !gender || !activity, !goal){
//       return res.status(300).json({error:"enter all filed"});
//     }
//     if(men){
//       BMR = 10 * weight + 6.25 *height - 5 * age +5
//     }
//     else{
//       BMR = 10 * weight + 6.25 * height - 5 * age - 161
//     }
//   }
//   catch(error){
//     return res.status(500).json({error:"failed to calculate"});
//   }

// };

// module.exports = {
//     calorieCalculator,
//   };