import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window'); // Get device width for responsiveness

const Calorie = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [goal, setGoal] = useState('gain_muscle'); // Default Goal
  const [activity, setActivity] = useState('sedentary'); // Default Activity

  // Mock data for Pie Chart
  const data = [
    { name: 'Carbs', grams: 506, color: '#2196F3' },
    { name: 'Protein', grams: 128, color: '#4CAF50' },
    { name: 'Fats', grams: 58, color: '#FF9800' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.header}>Nutrition Guidance</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Height Input */}
            <View style={styles.inputWrapper}>
              <TextInput placeholder="Height" style={styles.input} keyboardType="number-pad" />
              <Text style={styles.unitText}>.ft</Text>
            </View>

            {/* Weight Input */}
            <View style={styles.inputWrapper}>
              <TextInput placeholder="Weight" style={styles.input} keyboardType="number-pad" />
              <Text style={styles.unitText}>kg</Text>
            </View>

            {/* Age Input */}
            <View style={styles.inputWrapper}>
              <TextInput placeholder="Age" style={styles.input} keyboardType="number-pad" />
              <Text style={styles.unitText}>.ft</Text>
            </View>

            {/* Goal Dropdown (With Proper Spacing & Height) */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Goal</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={goal}
                  onValueChange={(itemValue) => setGoal(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Gain Muscle" value="gain_muscle" />
                  <Picker.Item label="Lose Weight" value="lose_weight" />
                  <Picker.Item label="Maintain Weight" value="maintain_weight" />
                  <Picker.Item label="Extreme Weight Loss" value="extreme_weight_loss" />
                </Picker>
              </View>
            </View>

            {/* Activity Level Dropdown (With Proper Spacing & Height) */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Activity Level</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={activity}
                  onValueChange={(itemValue) => setActivity(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Sedentary (Little to no exercise)" value="sedentary" />
                  <Picker.Item label="Lightly Active (1-3 days/week)" value="lightly_active" />
                  <Picker.Item label="Moderately Active (3-5 days/week)" value="moderately_active" />
                  <Picker.Item label="Very Active (6-7 days/week)" value="very_active" />
                  <Picker.Item label="Super Active (Intense exercise/physical job)" value="super_active" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <TouchableOpacity style={styles.genderOption} onPress={() => setSelectedGender('Male')}>
              <Ionicons name={selectedGender === 'Male' ? 'radio-button-on' : 'radio-button-off'} size={20} color="black" />
              <Text style={styles.genderText}> Male</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.genderOption} onPress={() => setSelectedGender('Female')}>
              <Ionicons name={selectedGender === 'Female' ? 'radio-button-on' : 'radio-button-off'} size={20} color="black" />
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
              width={width * 0.9} // Responsive width
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 20,
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
  dropdownContainer: {
    marginBottom: 15, // Added spacing between dropdowns
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
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
    width: width * 0.95, // Responsive width
    alignSelf: 'center',
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
