import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BMIChartProps {
  weight: number | string;
  height: number | string;
}

const BMIChart: React.FC<BMIChartProps> = ({ weight, height }) => {
  // Convert weight and height to numbers (in case they're strings)
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  
  // Calculate BMI: weight(kg) / (height(m) * height(m))
  const calculateBMI = (): number => {
    if (!weightNum || !heightNum) return 0;
    
    // Convert height from cm to m
    const heightInMeters = heightNum / 100;
    return weightNum / (heightInMeters * heightInMeters);
  };
  
  const bmi = calculateBMI();
  const bmiRounded = bmi.toFixed(1);
  
  // Determine BMI category and position
  const getBMICategory = (): string => {
    if (bmi < 16) return 'Severely underweight';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Moderately obese';
    return 'Severely obese';
  };
  
  // Calculate the position of the indicator arrow (as percentage)
  const getIndicatorPosition = (): number => {
    if (bmi <= 15) return 0;
    if (bmi >= 40) return 100;
    
    // Map BMI range to percentage (15-40 BMI to 0-100%)
    const rangeMin = 15;
    const rangeMax = 40;
    const percentage = ((bmi - rangeMin) / (rangeMax - rangeMin)) * 100;
    return percentage;
  };
  
  const indicatorPosition = getIndicatorPosition();
  const bmiCategory = getBMICategory();
  
  // Determine the color for the BMI category
  const getBMICategoryColor = (): string => {
    if (bmi < 16) return '#4169E1'; // Dark blue for severely underweight
    if (bmi < 18.5) return '#73ABFF'; // Light blue for underweight
    if (bmi < 25) return '#66CDAA'; // Teal for healthy
    if (bmi < 30) return '#FFD700'; // Yellow for overweight
    if (bmi < 35) return '#FFA07A'; // Orange for moderately obese
    return '#FF6347'; // Red for severely obese
  };
  
  // Render nothing if we don't have valid height and weight
  if (!weightNum || !heightNum) {
    return null;
  }
  
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
          {/* Triangle indicator */}
          <View style={[styles.triangleIndicator, { left: `${indicatorPosition}%` }]} />
          
          {/* BMI color bar */}
          <View style={styles.bmiColorBar}>
            <View style={styles.bmiBlue} />
            <View style={styles.bmiLightBlue} />
            <View style={styles.bmiTeal} />
            <View style={styles.bmiYellow} />
            <View style={styles.bmiOrange} />
            <View style={styles.bmiRed} />
          </View>
          
          {/* BMI scale numbers */}
          <View style={styles.bmiScaleNumbers}>
            <Text style={styles.scaleNumber}>15</Text>
            <Text style={styles.scaleNumber}>16</Text>
            <Text style={styles.scaleNumber}>18.5</Text>
            <Text style={styles.scaleNumber}>25</Text>
            <Text style={styles.scaleNumber}>30</Text>
            <Text style={styles.scaleNumber}>35</Text>
            <Text style={styles.scaleNumber}>40</Text>
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
  bmiBlue: {
    flex: 1,
    backgroundColor: '#4169E1', // Dark blue
  },
  bmiLightBlue: {
    flex: 1,
    backgroundColor: '#73ABFF', // Light blue
  },
  bmiTeal: {
    flex: 1,
    backgroundColor: '#66CDAA', // Teal
  },
  bmiYellow: {
    flex: 1,
    backgroundColor: '#FFD700', // Yellow
  },
  bmiOrange: {
    flex: 1,
    backgroundColor: '#FFA07A', // Orange
  },
  bmiRed: {
    flex: 1,
    backgroundColor: '#FF6347', // Red
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