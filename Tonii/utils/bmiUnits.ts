/**
 * Utility functions for BMI calculations and categorization
 */

/**
 * Calculate BMI from weight in kg and height in cm
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @returns BMI value (weight / height² in m²)
 */
export const calculateBMI = (weight: number | string, height: number | string): number => {
    // Convert strings to numbers if needed
    const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
    const heightNum = typeof height === 'string' ? parseFloat(height) : height;
    
    // Guard against invalid inputs
    if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
      return 0;
    }
    
    // Convert height from cm to meters and calculate BMI
    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);
    
    // Round to 1 decimal place
    return Math.round(bmi * 10) / 10;
  };
  
  /**
   * Get BMI category based on BMI value
   * @param bmi - BMI value
   * @returns Category name as string
   */
  export const getBMICategory = (bmi: number): string => {
    if (bmi < 16) return 'Severely underweight';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Moderately obese';
    return 'Severely obese';
  };
  
  /**
   * Get color code for a BMI category
   * @param bmi - BMI value
   * @returns Color code as string (hex)
   */
  export const getBMICategoryColor = (bmi: number): string => {
    if (bmi < 16) return '#4169E1'; // Dark blue for severely underweight
    if (bmi < 18.5) return '#73ABFF'; // Light blue for underweight
    if (bmi < 25) return '#66CDAA'; // Teal for healthy
    if (bmi < 30) return '#FFD700'; // Yellow for overweight
    if (bmi < 35) return '#FFA07A'; // Orange for moderately obese
    return '#FF6347'; // Red for severely obese
  };
  
  /**
   * Calculate position percentage for BMI indicator on scale
   * @param bmi - BMI value
   * @returns Position as percentage (0-100)
   */
  export const getBMIIndicatorPosition = (bmi: number): number => {
    // Clamp values to the range
    const clampedBMI = Math.max(15, Math.min(40, bmi));
    
    // Map BMI range (15-40) to percentage (0-100%)
    const range = 40 - 15; // 25
    const percentage = ((clampedBMI - 15) / range) * 100;
    
    return percentage;
  };
  
  /**
   * Calculate age from date of birth
   * @param dob - Date of birth string (YYYY-MM-DD format)
   * @returns Age in years as number
   */
  export const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };