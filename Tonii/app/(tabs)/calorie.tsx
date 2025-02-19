import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const Calorie = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  // Mock data for Pie Chart
  const data = [
    { name: 'Carbs', grams: 506, color: '#4A90E2' },
    { name: 'Protein', grams: 128, color: '#3CB371' },
    { name: 'Fats', grams: 58, color: '#FFCC00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.header}>Nutrition Guidance</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        {['Height', 'Weight', 'Age', 'Goal', 'Activity'].map((field, index) => (
          <View key={index} style={styles.inputWrapper}>
            <TextInput placeholder={field} style={styles.input} />
            <Text style={styles.unitText}>
              {field === 'Weight' ? 'kg' : field === 'Height' ? '.ft' : '.ft'}
            </Text>
          </View>
        ))}
      </View>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <Text style={styles.genderLabel}>Gender</Text>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('Male')}
        >
          <Ionicons
            name={selectedGender === 'Male' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="black"
          />
          <Text style={styles.genderText}> Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('Female')}
        >
          <Ionicons
            name={selectedGender === 'Female' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="black"
          />
          <Text style={styles.genderText}> Female</Text>
        </TouchableOpacity>
      </View>

      {/* Generate Plan Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Generate Plan</Text>
      </TouchableOpacity>

      {/* Total Calories & Macros Section */}
      <View style={styles.calorieCard}>
        <Text style={styles.calorieTitle}>Total Calories</Text>
        <Text style={styles.calorieValue}>3060 kcal/day</Text>

        <Text style={styles.macrosTitle}>Macros</Text>
        <PieChart
          data={data.map((item) => ({
            name: item.name,
            population: item.grams,
            color: item.color,
            legendFontColor: '#333',
            legendFontSize: 12,
          }))}
          width={300}
          height={150}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            color: () => 'black',
          }}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          hasLegend={true}
          absolute
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  genderText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  calorieCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
    textAlign: 'right',
    marginBottom: 10,
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Calorie;
