import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';

interface BMIChartProps {
  weight: number | string;
  height: number | string;
  age?: number | string;
  gender?: string;
}

const BMIChart: React.FC<BMIChartProps> = ({ weight, height, age = 25, gender = 'male' }) => {
  const [barWidth, setBarWidth] = useState(0);

  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;
  const ageNum = typeof age === 'string' ? parseFloat(age) : age;

  const calculateBMI = (): number => {
    if (!weightNum || !heightNum) return 0;
    const heightInMeters = heightNum / 100;
    let baseBMI = weightNum / (heightInMeters * heightInMeters);

    if (ageNum > 65) baseBMI -= 1;
    else if (ageNum < 18) baseBMI += 0.5;

    if (gender.toLowerCase() === 'female') baseBMI -= 0.5;

    return baseBMI;
  };

  const bmi = calculateBMI();
  const bmiRounded = bmi.toFixed(1);

  const getBMICategory = (): string => {
    if (bmi < 16.0) return 'Severely Underweight';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    if (bmi < 35.0) return 'Moderately Obese';
    if (bmi < 40.0) return 'Severely Obese';
    return 'Morbidly Obese';
  };

  const getBMICategoryColor = (): string => {
    if (bmi < 16.0) return '#FFFACD';
    if (bmi < 18.5) return '#FFF59D';
    if (bmi < 25.0) return '#81C784';
    if (bmi < 30.0) return '#FFB74D';
    if (bmi < 35.0) return '#FF8A65';
    if (bmi < 40.0) return '#E57373';
    return '#D32F2F';
  };

  const getIndicatorPosition = () => {
    if (bmi <= 15) return 0;
    if (bmi >= 45) return barWidth;

    const percentage = ((bmi - 15) / (45 - 15)) * barWidth;
    return percentage;
  };

  const indicatorPosition = getIndicatorPosition();
  const bmiCategory = getBMICategory();

  const handleBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  if (!weightNum || !heightNum) return null;

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

        <View style={styles.bmiScaleContainer}>
          {/* BMI Scale with onLayout */}
          <View style={styles.bmiColorBar} onLayout={handleBarLayout}>
            {/* Triangle indicator */}
            {barWidth > 0 && (
              <View
                style={[
                  styles.triangleIndicator,
                  { transform: [{ translateX: indicatorPosition - 10 }] },
                ]}
              />
            )}

            {/* Color segments */}
            <View style={[styles.bmiSegment, { flex: 1, backgroundColor: '#FFFACD' }]} />
            <View style={[styles.bmiSegment, { flex: 2.5, backgroundColor: '#FFF59D' }]} />
            <View style={[styles.bmiSegment, { flex: 6.5, backgroundColor: '#81C784' }]} />
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#FFB74D' }]} />
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#FF8A65' }]} />
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#E57373' }]} />
            <View style={[styles.bmiSegment, { flex: 5, backgroundColor: '#D32F2F' }]} />
          </View>

          {/* Scale numbers */}
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
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    zIndex: 10,
  },
  bmiColorBar: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
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
