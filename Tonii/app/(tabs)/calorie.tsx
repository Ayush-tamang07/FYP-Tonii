import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import apiHandler from '../../context/APIHandler';

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

interface CalorieResult {
  maintainWeight: number;
  mildWeightLoss: number;
  weightLoss: number;
  extremeWeightLoss: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  }
}

const Calorie: React.FC = () => {
  // Form state management
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('Male');
  const [goal, setGoal] = useState<string>('maintainWeight');
  const [goalText, setGoalText] = useState<string>('Maintain Weight');
  const [activity, setActivity] = useState<string>('moderately_active');
  const [activityText, setActivityText] = useState<string>('Moderately Active (3-5 days/week)');
  
  // Loading and results state
  const [loading, setLoading] = useState<boolean>(false);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Bottom sheet states
  const [bottomSheetType, setBottomSheetType] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const backDrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1}/>
  ), []);

  // Goal options
  const goalOptions: Option[] = [
    { label: 'Maintain Weight', value: 'maintainWeight' },
    { label: 'Mild Weight Loss', value: 'mildWeightLoss' },
    { label: 'Weight Loss', value: 'weightLoss' },
    { label: 'Extreme Weight Loss', value: 'extremeWeightLoss' },
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
    setBottomSheetType(type);
    bottomSheetRef.current?.expand();
  };

  // Function to close bottom sheet
  const closeBottomSheet = (): void => {
    bottomSheetRef.current?.close();
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

  // Calculate calories and macros
  const calculateCalories = async () => {
    // Form validation
    if (!height || !weight || !age) {
      Alert.alert('Missing Information', 'Please fill in all fields to calculate your calories.');
      return;
    }

    try {
      setLoading(true);

      // Call API to calculate calories
      const response = await apiHandler.post('/calculate', {
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        gender: selectedGender,
        activity: activity
      });

      if (response.data) {
        setCalorieResult(response.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error calculating calories:', error);
      Alert.alert('Error', 'Failed to calculate calories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare macros data for pie chart
  const getMacrosChartData = (): MacroData[] => {
    if (!calorieResult) {
      return [
        { name: 'Carbs', grams: 306, percentage: '50%', color: '#4361EE' },
        { name: 'Protein', grams: 153, percentage: '25%', color: '#3A0CA3' },
        { name: 'Fats', grams: 68, percentage: '25%', color: '#F72585' },
      ];
    }

    const { protein, carbs, fat } = calorieResult.macros;
    const total = protein + carbs + fat;
    
    return [
      { 
        name: 'Carbs', 
        grams: carbs, 
        percentage: `${Math.round((carbs / total) * 100)}%`, 
        color: '#4361EE' 
      },
      { 
        name: 'Protein', 
        grams: protein, 
        percentage: `${Math.round((protein / total) * 100)}%`, 
        color: '#3A0CA3' 
      },
      { 
        name: 'Fats', 
        grams: fat, 
        percentage: `${Math.round((fat / total) * 100)}%`, 
        color: '#F72585' 
      },
    ];
  };

  // Get current calorie goal based on selected goal
  const getCurrentCalorieGoal = (): number => {
    if (!calorieResult) return 2560;
    
    switch (goal) {
      case 'maintainWeight':
        return calorieResult.maintainWeight;
      case 'mildWeightLoss':
        return calorieResult.mildWeightLoss;
      case 'weightLoss':
        return calorieResult.weightLoss;
      case 'extremeWeightLoss':
        return calorieResult.extremeWeightLoss;
      default:
        return calorieResult.maintainWeight;
    }
  };

  // Get macros data for display
  const macrosData = getMacrosChartData();

  // Render bottom sheet content based on type
  const renderBottomSheetContent = () => {
    let title = '';
    let options: Option[] = [];
    let currentValue = '';
    let handleSelect: any = null;

    if (bottomSheetType === 'goal') {
      title = 'Select Goal';
      options = goalOptions;
      currentValue = goal;
      handleSelect = handleGoalSelect;
    } else if (bottomSheetType === 'activity') {
      title = 'Select Activity Level';
      options = activityOptions;
      currentValue = activity;
      handleSelect = handleActivitySelect;
    } else if (bottomSheetType === 'gender') {
      title = 'Select Gender';
      options = genderOptions;
      currentValue = selectedGender;
      handleSelect = handleGenderSelect;
    }

    return (
      <BottomSheetView className="bg-white p-0">
        <View className="items-center py-1 mb-1">
          <Text className="text-gray-600 font-medium" numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View className="divide-y divide-gray-100">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row justify-between items-center px-6 py-4 ${currentValue === option.value ? 'bg-orange-50' : ''}`}
              onPress={() => {
                if (bottomSheetType === 'gender') {
                  handleSelect(option.value);
                } else {
                  handleSelect(option.value, option.label);
                }
              }}
            >
              <Text className={`text-base ${currentValue === option.value ? 'text-orange-600 font-medium' : 'text-gray-800'}`}>
                {option.label}
              </Text>
              {currentValue === option.value && (
                <Ionicons name="checkmark-circle" size={22} color="#FF6F00" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View className="h-8" />
      </BottomSheetView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="px-4 py-4"
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-800 mb-0.5">Nutrition Guidance</Text>
            <Text className="text-sm text-gray-500">Calculate your daily calories and macros</Text>
          </View>

          {/* Input Form Card */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            {/* Height and Weight in same row */}
            <View className="flex-row justify-between mb-1.5">
              {/* Height Input */}
              <View className="w-[48%] mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Height</Text>
                <View className="flex-row items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50">
                  <TextInput 
                    placeholder="Enter height" 
                    className="flex-1 text-base text-gray-800" 
                    keyboardType="number-pad" 
                    value={height}
                    onChangeText={setHeight}
                  />
                  <Text className="text-sm text-gray-500 ml-1.5">cm</Text>
                </View>
              </View>

              {/* Weight Input */}
              <View className="w-[48%] mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Weight</Text>
                <View className="flex-row items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50">
                  <TextInput 
                    placeholder="Enter weight" 
                    className="flex-1 text-base text-gray-800" 
                    keyboardType="number-pad" 
                    value={weight}
                    onChangeText={setWeight}
                  />
                  <Text className="text-sm text-gray-500 ml-1.5">kg</Text>
                </View>
              </View>
            </View>

            {/* Age and Gender in same row */}
            <View className="flex-row justify-between mb-1.5">
              {/* Age Input */}
              <View className="w-[48%] mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Age</Text>
                <View className="flex-row items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50">
                  <TextInput 
                    placeholder="Enter age" 
                    className="flex-1 text-base text-gray-800" 
                    keyboardType="number-pad" 
                    value={age}
                    onChangeText={setAge}
                  />
                  <Text className="text-sm text-gray-500 ml-1.5">years</Text>
                </View>
              </View>

              {/* Gender Selection */}
              <View className="w-[48%] mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-1">Gender</Text>
                <TouchableOpacity 
                  className="flex-row justify-between items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50"
                  onPress={() => openBottomSheet('gender')}
                >
                  <Text className="text-base text-gray-800">{selectedGender}</Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal Selection */}
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Goal</Text>
              <TouchableOpacity 
                className="flex-row justify-between items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50"
                onPress={() => openBottomSheet('goal')}
              >
                <Text className="text-base text-gray-800">{goalText}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Activity Level Selection */}
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-700 mb-1">Activity Level</Text>
              <TouchableOpacity 
                className="flex-row justify-between items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50"
                onPress={() => openBottomSheet('activity')}
              >
                <Text className="text-base text-gray-800 flex-1" numberOfLines={1}>{activityText}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Calculate Button */}
            <TouchableOpacity 
              className={`rounded-lg h-12 justify-center items-center mt-1 ${loading ? 'bg-gray-400' : 'bg-[#FF6909]'}`}
              onPress={calculateCalories}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-base font-semibold">Calculate Calories</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Results Card - Show only after calculation */}
          {showResults && (
            <View className="bg-white rounded-xl p-4 shadow-sm mb-16">
              <View className="flex-row justify-between items-center mb-2.5">
                <View>
                  <Text className="text-sm text-gray-500 mb-0.5">Daily Calorie Goal</Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {getCurrentCalorieGoal().toLocaleString()} <Text className="text-base font-normal text-gray-500">kcal</Text>
                  </Text>
                </View>
                <View className="bg-orange-50 px-2.5 py-1.5 rounded-full">
                  <Text className="text-xs font-semibold text-orange-600">{goalText}</Text>
                </View>
              </View>

              <View className="h-px bg-gray-100 my-3.5" />

              <Text className="text-base font-semibold text-gray-800 mb-3.5">Recommended Macros</Text>
              
              <View className="items-center">
                <PieChart
                  data={macrosData.map((item) => ({
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

              <View className="mt-2">
                {macrosData.map((item, index) => (
                  <View key={index} className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <Text className="text-base text-gray-800">{item.name}</Text>
                    </View>
                    <Text className="text-base font-semibold text-gray-800">
                      {item.grams}g <Text className="text-sm font-normal text-gray-500">({item.percentage})</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Sheet for selections */}
      <BottomSheet 
        ref={bottomSheetRef} 
        snapPoints={snapPoints} 
        index={-1} 
        enablePanDownToClose={true}
        backdropComponent={backDrop}
        handleIndicatorStyle={{ backgroundColor: '#CCCCCC', width: 40 }}
      >
        {renderBottomSheetContent()}
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Calorie;