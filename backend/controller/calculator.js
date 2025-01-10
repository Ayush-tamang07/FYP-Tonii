const prisma = require("../utils/PrismaClient.js");

const calculate = async (req, res) => {
  try {
    const { height, weight, age, gender, activity } = req.body;

    if (!height || !weight || !age || !gender || !activity) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    // Calculate BMR 
    let BMR;
    if (gender.toLowerCase() === "male") {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender.toLowerCase() === "female") {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      return res.status(400).json({ error: "Invalid gender. Use 'male' or 'female'." });
    }

    // Activity multiplier based on activity level
    const activityMultiplier = {
      sedentary: 1.2, // Little to no exercise
      lightly_active: 1.375, // Light exercise 1-3 days/week
      moderately_active: 1.55, // Moderate exercise 3-5 days/week
      very_active: 1.725, // Hard exercise 6-7 days/week
      super_active: 1.9 // Very intense exercise or physical job
    };

    const multiplier = activityMultiplier[activity.toLowerCase()];

    if (!multiplier) {
      return res.status(400).json({
        error: "Invalid activity level. Use one of: sedentary, lightly_active, moderately_active, very_active, super_active."
      });
    }

    const TDEE = BMR * multiplier; // Total Daily Energy Expenditure

    // Calculate calorie targets for different goals
    const maintainWeight = TDEE;
    const mildWeightLoss = TDEE - 250; // 250 calorie deficit
    const weightLoss = TDEE - 500; // 500 calorie deficit
    const extremeWeightLoss = TDEE - 1000; // 1000 calorie deficit

    // Macronutrient calculation (assuming standard macros)
    const proteinPerKg = 2; // 2 grams of protein per kg of body weight
    const proteinCalories = 4; // 1 gram of protein = 4 calories
    const fatPercentage = 0.25; // Fat as 25% of total calories
    const fatCalories = 9; // 1 gram of fat = 9 calories
    const carbCalories = 4; // 1 gram of carbs = 4 calories

    // Protein intake calculation
    const proteinGrams = weight * proteinPerKg;
    const proteinCaloriesTotal = proteinGrams * proteinCalories;

    // Fat intake calculation (25% of TDEE)
    const fatCaloriesTotal = maintainWeight * fatPercentage;
    const fatGrams = fatCaloriesTotal / fatCalories;

    // Carbs: Remaining calories after protein and fat are allocated
    const remainingCalories = maintainWeight - proteinCaloriesTotal - fatCaloriesTotal;
    const carbsGrams = remainingCalories / carbCalories;

    res.status(200).json({
      maintainWeight: Math.round(maintainWeight),
      mildWeightLoss: Math.round(mildWeightLoss),
      weightLoss: Math.round(weightLoss),
      extremeWeightLoss: Math.round(extremeWeightLoss),
      macros: {
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carbs: Math.round(carbsGrams)
      }
    });
  } catch (error) {
    console.error("Error calculating calories:", error);
    res.status(500).json({ error: "Failed to calculate" });
  }
};

module.exports = {
  calculate
};
