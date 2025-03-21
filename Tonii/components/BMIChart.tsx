import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BMIChartProps {
  weight: number | string;
  height: number | string;
  age?: number | string;
  gender?: string;
}

const BMIChart: React.FC<BMIChartProps> = ({ weight, height, age = 25, gender = 'male' }) => {
  // Convert weight and height to numbers (in case they're strings)
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  const ageNum = typeof age === 'string' ? parseFloat(age) : age;
  
  // Calculate BMI: weight(kg) / (height(m) * height(m))
  const calculateBMI = (): number => {
    if (!weightNum || !heightNum) return 0;
    
    // Convert height from cm to m
    const heightInMeters = heightNum / 100;
    let baseBMI = weightNum / (heightInMeters * heightInMeters);
    
    // Apply age and gender adjustments
    // These are small adjustments based on research that suggests BMI interpretation
    // can vary slightly with age and gender
    let adjustedBMI = baseBMI;
    
    // Age adjustment: Older adults may have different body composition
    if (ageNum > 65) {
      adjustedBMI -= 1; // Allow slightly higher BMI for elderly
    } else if (ageNum < 18) {
      // For teens/children, different charts should be used, but we'll make a small adjustment
      adjustedBMI += 0.5;
    }
    
    // Gender adjustment: women typically have higher body fat percentage
    if (gender.toLowerCase() === 'female') {
      adjustedBMI -= 0.5; // Slight adjustment for women
    }
    
    return baseBMI; // Return raw BMI for standard WHO classification
  };
  
  const bmi = calculateBMI();
  const bmiRounded = bmi.toFixed(1);
  
  // Determine BMI category using WHO classification
  const getBMICategory = (): string => {
    if (bmi < 16.0) return 'Severely Underweight';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    if (bmi < 35.0) return 'Moderately Obese';
    if (bmi < 40.0) return 'Severely Obese';
    return 'Morbidly Obese';
  };
  
  // Calculate the position of the indicator arrow (as percentage)
  const getIndicatorPosition = (): number => {
    if (bmi <= 15) return 0;
    if (bmi >= 45) return 100;
    
    // Map BMI range to percentage (15-45 BMI to 0-100%)
    const rangeMin = 15;
    const rangeMax = 45;
    const percentage = ((bmi - rangeMin) / (rangeMax - rangeMin)) * 100;
    return percentage;
  };
  
  const indicatorPosition = getIndicatorPosition();
  const bmiCategory = getBMICategory();
  
  // Determine the color for the BMI category
  const getBMICategoryColor = (): string => {
    if (bmi < 16.0) return '#FFFACD'; // Pale yellow for severely underweight
    if (bmi < 18.5) return '#FFF59D'; // Yellow for underweight
    if (bmi < 25.0) return '#81C784'; // Green for normal
    if (bmi < 30.0) return '#FFB74D'; // Orange for overweight
    if (bmi < 35.0) return '#FF8A65'; // Light red for moderately obese
    if (bmi < 40.0) return '#E57373'; // Medium red for severely obese
    return '#D32F2F'; // Dark red for morbidly obese
  };
  
  // Define advice based on BMI category
  const getBMIAdvice = (): string => {
    if (bmi < 18.5) return 'Consider increasing calorie intake with nutritious foods';
    if (bmi < 25.0) return 'Maintain healthy eating and regular physical activity';
    if (bmi < 30.0) return 'Consider moderate exercise and balanced diet';
    return 'Consult with healthcare professional for weight management plan';
  };
  
  // Render nothing if we don't have valid height and weight
  if (!weightNum || !heightNum) {
    return null;
  }
  
  // Define the styles for the triangle indicator with the percentage position
  const indicatorStyle = {
    left: indicatorPosition + '%' as any
  };
  
  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>BMI</Text>
      </View>

      <View style={styles.bmiContainer}>
        <View style={styles.bmiValueContainer}>
          <Text style={styles.bmiValue}>{bmiRounded}</Text>
          <View style={styles.bmiCategoryContainer}>
            <View style={[styles.categoryDot, { backgroundColor: getBMICategoryColor() }]} />
            <Text style={styles.categoryText}>{bmiCategory}</Text>
          </View>
        </View>
        
        {/* BMI Scale */}
        <View style={styles.bmiScaleContainer}>
          {/* Triangle indicator - using the separate style object */}
          <View style={[styles.triangleIndicator, indicatorStyle]} />
          
          {/* BMI color bar */}
          <View style={styles.bmiColorBar}>
            <View style={[styles.bmiSegment, { flex: 1, backgroundColor: '#FFFACD' }]} /> {/* < 16.0 */}
            <View style={[styles.bmiSegment, { flex: 2.5, backgroundColor: '#FFF59D' }]} /> {/* 16.0-18.4 */}
            <View style={[styles.bmiSegment, { flex: 6.5, backgroundColor: '#81C784' }]} /> {/* 18.5-24.9 */}
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#FFB74D' }]} /> {/* 25.0-29.9 */}
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#FF8A65' }]} /> {/* 30.0-34.9 */}
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#E57373' }]} /> {/* 35.0-39.9 */}
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#D32F2F' }]} /> {/* > 40.0 */}
          </View>
          
          {/* BMI scale numbers */}
          <View style={styles.bmiScaleNumbers}>
            <Text style={styles.scaleNumber}>16.0</Text>
            <Text style={styles.scaleNumber}>18.5</Text>
            <Text style={styles.scaleNumber}>25.0</Text>
            <Text style={styles.scaleNumber}>30.0</Text>
            <Text style={styles.scaleNumber}>35.0</Text>
            <Text style={styles.scaleNumber}>40.0</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  bmiContainer: {
    paddingVertical: 10,
  },
  bmiValueContainer: {
    marginBottom: 20,
  },
  bmiValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  bmiCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  bmiScaleContainer: {
    marginBottom: 15,
    paddingTop: 10,
  },
  triangleIndicator: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    transform: [{ translateX: -10 }],
    zIndex: 10,
  },
  bmiColorBar: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bmiSegment: {
    height: '100%',
  },
  bmiScaleNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  scaleNumber: {
    fontSize: 12,
    color: '#666',
  }
});

export default BMIChart;