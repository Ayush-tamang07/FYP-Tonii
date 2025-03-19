import React, { useState, useRef } from 'react';
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
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Define TypeScript interfaces
interface MacroData {
  name: string;
  grams: number;
  percentage: string;
  color: string;
}

interface Option {
  label: string;
  value: string;
}

const Calorie: React.FC = () => {
  // State management
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('Male');
  const [goal, setGoal] = useState<string>('gain_muscle');
  const [goalText, setGoalText] = useState<string>('Gain Muscle');
  const [activity, setActivity] = useState<string>('moderately_active');
  const [activityText, setActivityText] = useState<string>('Moderately Active (3-5 days/week)');
  
  // Bottom sheet states
  const [bottomSheetOpen, setBottomSheetOpen] = useState<string | null>(null); // 'goal', 'activity', or 'gender'

  // Data for the pie chart
  const data: MacroData[] = [
    { name: 'Carbs', grams: 306, percentage: '50%', color: '#4361EE' },
    { name: 'Protein', grams: 153, percentage: '25%', color: '#3A0CA3' },
    { name: 'Fats', grams: 68, percentage: '25%', color: '#F72585' },
  ];

  // Goal options
  const goalOptions: Option[] = [
    { label: 'Gain Muscle', value: 'gain_muscle' },
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
    { label: 'Extreme Weight Loss', value: 'extreme_weight_loss' },
  ];

  // Activity level options
  const activityOptions: Option[] = [
    { label: 'Sedentary (Little to no exercise)', value: 'sedentary' },
    { label: 'Lightly Active (1-3 days/week)', value: 'lightly_active' },
    { label: 'Moderately Active (3-5 days/week)', value: 'moderately_active' },
    { label: 'Very Active (6-7 days/week)', value: 'very_active' },
    { label: 'Super Active (Intense exercise/physical job)', value: 'super_active' },
  ];

  // Gender options
  const genderOptions: Option[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  // Function to open bottom sheet
  const openBottomSheet = (type: string): void => {
    setBottomSheetOpen(type);
  };

  // Function to close bottom sheet
  const closeBottomSheet = (): void => {
    setBottomSheetOpen(null);
  };

  // Function to handle goal selection
  const handleGoalSelect = (value: string, label: string): void => {
    setGoal(value);
    setGoalText(label);
    closeBottomSheet();
  };

  // Function to handle activity selection
  const handleActivitySelect = (value: string, label: string): void => {
    setActivity(value);
    setActivityText(label);
    closeBottomSheet();
  };

  // Function to handle gender selection
  const handleGenderSelect = (value: string): void => {
    setSelectedGender(value);
    closeBottomSheet();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Nutrition Guidance</Text>
            <Text style={styles.headerSubtitle}>Calculate your daily calories and macros</Text>
          </View>

          {/* Input Form Card */}
          <View style={styles.formCard}>
            {/* Height and Weight in same row */}
            <View style={styles.rowContainer}>
              {/* Height Input */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Height</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder="Enter height" 
                    style={styles.input} 
                    keyboardType="number-pad" 
                    value={height}
                    onChangeText={setHeight}
                  />
                  <Text style={styles.unitText}>ft</Text>
                </View>
              </View>

              {/* Weight Input */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Weight</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder="Enter weight" 
                    style={styles.input} 
                    keyboardType="number-pad" 
                    value={weight}
                    onChangeText={setWeight}
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>
            </View>

            {/* Age and Gender in same row */}
            <View style={styles.rowContainer}>
              {/* Age Input */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder="Enter age" 
                    style={styles.input} 
                    keyboardType="number-pad" 
                    value={age}
                    onChangeText={setAge}
                  />
                  <Text style={styles.unitText}>years</Text>
                </View>
              </View>

              {/* Gender Selection */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TouchableOpacity 
                  style={styles.selectionButton}
                  onPress={() => openBottomSheet('gender')}
                >
                  <Text style={styles.selectionText}>{selectedGender}</Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Goal</Text>
              <TouchableOpacity 
                style={styles.selectionButton}
                onPress={() => openBottomSheet('goal')}
              >
                <Text style={styles.selectionText}>{goalText}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Activity Level Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <TouchableOpacity 
                style={styles.selectionButton}
                onPress={() => openBottomSheet('activity')}
              >
                <Text style={styles.selectionText} numberOfLines={1}>{activityText}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Calculate Button (now inside form card) */}
            <TouchableOpacity style={styles.generateButton}>
              <Text style={styles.generateButtonText}>Calculate Calories</Text>
            </TouchableOpacity>
          </View>

          {/* Results Card */}
          <View style={styles.resultsCard}>
            <View style={styles.calorieHeader}>
              <View>
                <Text style={styles.calorieLabel}>Daily Calorie Goal</Text>
                <Text style={styles.calorieValue}>2,560 <Text style={styles.calorieUnit}>kcal</Text></Text>
              </View>
              <View style={styles.goalBadge}>
                <Text style={styles.goalBadgeText}>{goalText}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <Text style={styles.macrosTitle}>Recommended Macros</Text>
            
            <View style={styles.chartContainer}>
              <PieChart
                data={data.map((item) => ({
                  name: item.name,
                  population: item.grams,
                  color: item.color,
                  legendFontColor: '#333',
                  legendFontSize: 12,
                }))}
                width={width * 0.85}
                height={180}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'transparent',
                  backgroundGradientTo: 'transparent',
                  color: () => 'black',
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                center={[10, 0]}
                absolute
              />
            </View>

            <View style={styles.macrosDetailContainer}>
              {data.map((item, index) => (
                <View key={index} style={styles.macroItem}>
                  <View style={styles.macroLabelContainer}>
                    <View style={[styles.macroColorIndicator, { backgroundColor: item.color }]} />
                    <Text style={styles.macroLabel}>{item.name}</Text>
                  </View>
                  <Text style={styles.macroValue}>{item.grams}g <Text style={styles.macroPercentage}>({item.percentage})</Text></Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Goal Bottom Sheet Modal */}
      <Modal
        visible={bottomSheetOpen === 'goal'}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalContainer}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Goal</Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {goalOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    goal === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleGoalSelect(option.value, option.label)}
                >
                  <Text style={[
                    styles.optionText,
                    goal === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {goal === option.value && (
                    <Ionicons name="checkmark-circle" size={22} color="#FF6F00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Activity Level Bottom Sheet Modal */}
      <Modal
        visible={bottomSheetOpen === 'activity'}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalContainer}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Activity Level</Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {activityOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    activity === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleActivitySelect(option.value, option.label)}
                >
                  <Text style={[
                    styles.optionText,
                    activity === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {activity === option.value && (
                    <Ionicons name="checkmark-circle" size={22} color="#FF6F00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Gender Bottom Sheet Modal */}
      <Modal
        visible={bottomSheetOpen === 'gender'}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalContainer}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Gender</Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    selectedGender === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleGenderSelect(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedGender === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedGender === option.value && (
                    <Ionicons name="checkmark-circle" size={22} color="#FF6F00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // marginTop: Platform.OS === 'ios' ? 50 : 0,
    marginTop:20
  },
  scrollViewContent: {
    padding: 14,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  halfWidth: {
    width: '48%',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  unitText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  selectionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fafafa',
  },
  selectionText: {
    fontSize: 15,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#FF6F00',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 60,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calorieLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  calorieValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieUnit: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#666',
  },
  goalBadge: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  goalBadgeText: {
    color: '#FF6F00',
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 14,
  },
  macrosTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  macrosDetailContainer: {
    marginTop: 8,
  },
  macroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 15,
    color: '#333',
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  macroPercentage: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'normal',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    maxHeight: '70%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionsContainer: {
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#FFF4E6',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FF6F00',
    fontWeight: '500',
  },
});

export default Calorie;