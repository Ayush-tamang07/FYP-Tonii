const prisma = require("../utils/PrismaClient.js");

const calculate = async (req, res) => {
  try {
    const { height, weight, age, gender, activity } = req.body;

    if (!height || !weight || !age || !gender || !activity) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    let BMR;
    if (gender.toLowerCase() === "male") {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender.toLowerCase() === "female") {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      return res
        .status(400)
        .json({ error: "Invalid gender. Use 'male' or 'female'." });
    }

    const activityMultiplier = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9,
    };

    const multiplier = activityMultiplier[activity.toLowerCase()];

    if (!multiplier) {
      return res.status(400).json({
        error:
          "Invalid activity level. Use one of: sedentary, lightly_active, moderately_active, very_active, super_active.",
      });
    }

    const TDEE = BMR * multiplier; // Total Daily Energy Expenditure

    const maintainWeight = TDEE;
    const mildWeightLoss = TDEE - 250; // 250 calorie deficit
    const weightLoss = TDEE - 500; // 500 calorie deficit
    const extremeWeightLoss = TDEE - 1000; // 1000 calorie deficit

    const proteinPerKg = 2; // 2 grams of protein per kg of body weight
    const proteinCalories = 4; // 1 gram of protein = 4 calories
    const fatPercentage = 0.25; // Fat as 25% of total calories
    const fatCalories = 9; // 1 gram of fat = 9 calories
    const carbCalories = 4; // 1 gram of carbs = 4 calories

    const proteinGrams = weight * proteinPerKg;
    const proteinCaloriesTotal = proteinGrams * proteinCalories;

    const fatCaloriesTotal = maintainWeight * fatPercentage;
    const fatGrams = fatCaloriesTotal / fatCalories;

    const remainingCalories =
      maintainWeight - proteinCaloriesTotal - fatCaloriesTotal;
    const carbsGrams = remainingCalories / carbCalories;

    res.status(200).json({
      maintainWeight: Math.round(maintainWeight),
      mildWeightLoss: Math.round(mildWeightLoss),
      weightLoss: Math.round(weightLoss),
      extremeWeightLoss: Math.round(extremeWeightLoss),
      macros: {
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carbs: Math.round(carbsGrams),
      },
    });
  } catch (error) {
    console.error("Error calculating calories:", error);
    res.status(500).json({ error: "Failed to calculate" });
  }
};

module.exports = {
  calculate,
};
