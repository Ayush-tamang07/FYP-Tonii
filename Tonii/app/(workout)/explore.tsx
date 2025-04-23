import React, { useState, useEffect } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  FlatList, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
  Image,
  StatusBar
} from "react-native";
import apiHandler from "@/context/APIHandler";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetchUserDetails } from '../../context/userAPI';
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

interface UserDetails {
  age: number | "";
  gender: string;
  height: number | "";
  weight: number | "";
}

interface UserPreferences {
  goal: string;
  experience: string;
  equipment: string;
  muscle: string;
}

interface Exercise {
  name: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  id?: number; // Adding optional id for saving to workout plan
}

const Explore: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    age: "",
    gender: "male",
    height: "",
    weight: "",
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    goal: "",
    experience: "",
    equipment: "",
    muscle: "",
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New state for workout save modal
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [savingWorkout, setSavingWorkout] = useState(false);

  // Predefined options for dropdown selections
  const goalOptions = ["lose weight", "build muscle", "strength", "endurance"];
  const experienceOptions = ["beginner", "intermediate", "advanced"];
  const equipmentOptions = ["none", "dumbbell", "barbell", "machine", "cable", "bodyweight"];
  const muscleOptions = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abs", "forearms", "calves"];

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setInitialLoading(true);
      try {
        const data = await fetchUserDetails();
        if (data) {
          // Calculate age from DOB if available
          let calculatedAge = "";
          if (data.dob) {
            const birthDate = new Date(data.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            
            calculatedAge = age.toString();
          }
          
          // Update user details with fetched data
          setUserDetails({
            age: calculatedAge ? parseInt(calculatedAge) : "",
            gender: data.gender || "male",
            height: data.height ? parseInt(data.height.toString()) : "",
            weight: data.weight ? parseInt(data.weight.toString()) : "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (name: string, value: string | number, category: "details" | "preferences") => {
    if (category === "details") {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserPreferences((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMuscleSelection = (muscle: string) => {
    const currentMuscles = userPreferences.muscle ? userPreferences.muscle.split(',').map(m => m.trim()) : [];
    
    if (currentMuscles.includes(muscle)) {
      // Remove the muscle if already selected
      const updatedMuscles = currentMuscles.filter(m => m !== muscle).join(', ');
      setUserPreferences(prev => ({ ...prev, muscle: updatedMuscles }));
    } else {
      // Add the muscle if not already selected
      const updatedMuscles = [...currentMuscles, muscle].join(', ');
      setUserPreferences(prev => ({ ...prev, muscle: updatedMuscles }));
    }
  };

  const getSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Form validation
      if (!userDetails.age || !userDetails.height || !userDetails.weight) {
        setError("Please fill in all user details");
        setLoading(false);
        return;
      }
      
      if (!userPreferences.goal || !userPreferences.experience || !userPreferences.muscle) {
        setError("Please fill in all user preferences");
        setLoading(false);
        return;
      }

      // Convert numeric fields to numbers to ensure proper API handling
      const formattedUserDetails = {
        ...userDetails,
        age: typeof userDetails.age === "string" ? parseInt(userDetails.age) : userDetails.age,
        height: typeof userDetails.height === "string" ? parseInt(userDetails.height) : userDetails.height,
        weight: typeof userDetails.weight === "string" ? parseInt(userDetails.weight) : userDetails.weight
      };

      const response = await apiHandler.post(
        "/suggestion",
        {
          user_details: formattedUserDetails,
          user_preferences: userPreferences,
        }
      );
      
      console.log("API response:", response.data);
      
      // Check the structure of the response and extract the suggestions array
      if (response.data && response.data.suggestions) {
        // Map potential exercise IDs from the response or use placeholders
        const suggestionsWithIds = response.data.suggestions.map((exercise: Exercise, index: number) => ({
          ...exercise,
          id: exercise.id || index + 1 // Use existing ID or create a temporary one
        }));
        setExercises(suggestionsWithIds);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch workout suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the save modal
  const handleOpenSaveModal = () => {
    if (exercises.length === 0) {
      Alert.alert("No Exercises", "Please generate a workout plan first.");
      return;
    }
    setSaveModalVisible(true);
  };

  // Handle saving the workout plan
  const handleSaveWorkout = async () => {
    if (!workoutTitle.trim()) {
      Alert.alert("Error", "Please enter a routine title");
      return;
    }

    setSavingWorkout(true);
    try {
      const token = await SecureStore.getItemAsync("AccessToken");

      // Create workout plan
      const response = await apiHandler.post(
        "/user/workout-plans",
        { name: workoutTitle },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const workoutPlanId = response.data?.data?.id;
      if (!workoutPlanId) throw new Error("Workout Plan ID missing");

      // Extract IDs from exercises if available, or fetch from database
      const exerciseIds = exercises.map(exercise => exercise.id).filter(id => id !== undefined);
      
      if (exerciseIds.length === 0) {
        throw new Error("No valid exercise IDs found");
      }

      // Add exercises to the workout plan
      const addExerciseResponse = await apiHandler.post(
        "/workout-plans/add-exercise",
        { workoutPlanId, exercises: exerciseIds },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (addExerciseResponse.status === 201) {
        Alert.alert("Success", "Workout routine saved successfully!");
        setSaveModalVisible(false);
        setWorkoutTitle("");
      } else {
        throw new Error("Failed to add exercises");
      }
    } catch (error: any) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", error.message || "Failed to save workout plan.");
    } finally {
      setSavingWorkout(false);
    }
  };

  // Difficulty level colors
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#757575';
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6F00" />
          <Text className="mt-4 text-gray-600 text-base font-medium">Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header with back button */}
      <View className="px-4 pt-4 pb-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/workout")} 
          className="p-2 left-2 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 text-center flex-1 mr-10">Generate Workout</Text>
      </View>
      
      <ScrollView 
        className="flex-1 bg-gray-50" 
        contentContainerClassName="px-4 py-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* User Details Section */}
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person-circle-outline" size={22} color="#FF6F00" />
            <Text className="text-lg font-bold ml-2 text-gray-800">Your Details</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">Age</Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
              placeholder="Enter your age"
              keyboardType="numeric"
              value={userDetails.age.toString()}
              onChangeText={(text) => handleChange("age", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">Gender</Text>
            <View className="flex-row mb-1">
              {["male", "female"].map(option => (
                <TouchableOpacity
                  key={`gender-${option}`}
                  className={`flex-1 px-4 py-3 mr-2 rounded-xl border ${
                    userDetails.gender === option 
                      ? 'bg-[#FF6F00] border-[#FF6F00]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => handleChange("gender", option, "details")}
                >
                  <Text className={`text-center ${
                    userDetails.gender === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">Height (cm)</Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
              placeholder="Enter your height"
              keyboardType="numeric"
              value={userDetails.height.toString()}
              onChangeText={(text) => handleChange("height", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700">Weight (kg)</Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={userDetails.weight.toString()}
              onChangeText={(text) => handleChange("weight", text ? Number(text) : "", "details")}
            />
          </View>
        </View>
        
        {/* Workout Preferences Section */}
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="options-outline" size={22} color="#FF6F00" />
            <Text className="text-lg font-bold ml-2 text-gray-800">Workout Preferences</Text>
          </View>
          
          <View className="mb-5">
            <Text className="text-sm font-medium mb-3 text-gray-700">Goal</Text>
            <View className="flex-row flex-wrap">
              {goalOptions.map(option => (
                <TouchableOpacity
                  key={`goal-${option}`}
                  className={`px-4 py-3 mr-2 mb-2 rounded-xl border ${
                    userPreferences.goal === option 
                      ? 'bg-[#FF6F00] border-[#FF6F00]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => handleChange("goal", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.goal === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-5">
            <Text className="text-sm font-medium mb-3 text-gray-700">Experience Level</Text>
            <View className="flex-row flex-wrap">
              {experienceOptions.map(option => (
                <TouchableOpacity
                  key={`experience-${option}`}
                  className={`px-4 py-3 mr-2 mb-2 rounded-xl border ${
                    userPreferences.experience === option 
                      ? 'bg-[#FF6F00] border-[#FF6F00]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => handleChange("experience", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.experience === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-5">
            <Text className="text-sm font-medium mb-3 text-gray-700">Equipment</Text>
            <View className="flex-row flex-wrap">
              {equipmentOptions.map(option => (
                <TouchableOpacity
                  key={`equipment-${option}`}
                  className={`px-4 py-3 mr-2 mb-2 rounded-xl border ${
                    userPreferences.equipment === option 
                      ? 'bg-[#FF6F00] border-[#FF6F00]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => handleChange("equipment", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.equipment === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-sm font-medium mb-3 text-gray-700">Target Muscles</Text>
            <View className="flex-row flex-wrap">
              {muscleOptions.map(muscle => (
                <TouchableOpacity
                  key={`muscle-${muscle}`}
                  className={`px-4 py-3 mr-2 mb-2 rounded-xl border ${
                    userPreferences.muscle.includes(muscle) 
                      ? 'bg-[#FF6F00] border-[#FF6F00]' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => handleMuscleSelection(muscle)}
                >
                  <Text className={`${
                    userPreferences.muscle.includes(muscle) 
                      ? 'text-white font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {userPreferences.muscle ? (
              <Text className="mt-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                <Text className="font-medium">Selected: </Text>
                {userPreferences.muscle.split(',').map(m => m.trim().charAt(0).toUpperCase() + m.trim().slice(1)).join(', ')}
              </Text>
            ) : (
              <Text className="mt-3 text-sm text-gray-500 italic p-2 bg-gray-50 rounded-lg">
                Select one or more muscle groups
              </Text>
            )}
          </View>
        </View>
        
        {error ? (
          <View className="bg-red-50 p-3 rounded-lg mb-5 border border-red-200">
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          </View>
        ) : null}
        
        <TouchableOpacity 
          className="bg-[#FF6F00] rounded-xl py-4 items-center mb-6 shadow-sm"
          onPress={getSuggestions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">Generate Workout Plan</Text>
          )}
        </TouchableOpacity>
        
        {exercises.length > 0 ? (
          <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="fitness-outline" size={22} color="#FF6F00" />
              <Text className="text-lg font-bold ml-2 text-gray-800">Your Personalized Workout</Text>
            </View>
            
            <FlatList
              data={exercises}
              keyExtractor={(item, index) => `exercise-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-3" />}
              renderItem={({ item }) => (
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <Text className="text-base font-bold mb-3 text-gray-800">{item.name}</Text>
                  
                  <View className="flex-row flex-wrap">
                    <View className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2 border border-blue-100">
                      <Text className="text-xs text-blue-700">
                        <Ionicons name="body-outline" size={12} style={{marginRight: 4}} />
                        {item.muscle.charAt(0).toUpperCase() + item.muscle.slice(1)}
                      </Text>
                    </View>
                    
                    <View className="bg-purple-50 rounded-full px-3 py-1 mr-2 mb-2 border border-purple-100">
                      <Text className="text-xs text-purple-700">
                        <Ionicons name="barbell-outline" size={12} style={{marginRight: 4}} />
                        {item.equipment.charAt(0).toUpperCase() + item.equipment.slice(1)}
                      </Text>
                    </View>
                    
                    <View 
                      className="rounded-full px-3 py-1 mr-2 mb-2 border"
                      style={{
                        backgroundColor: `${getDifficultyColor(item.difficulty)}20`,
                        borderColor: `${getDifficultyColor(item.difficulty)}40`
                      }}
                    >
                      <Text 
                        className="text-xs" 
                        style={{color: getDifficultyColor(item.difficulty)}}
                      >
                        <Ionicons name="stats-chart-outline" size={12} style={{marginRight: 4}} />
                        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
            
            {/* Save Workout Button */}
            <TouchableOpacity 
              className="mt-5 rounded-xl py-4 items-center overflow-hidden"
              onPress={handleOpenSaveModal}
            >
              <LinearGradient
                colors={['#FF6F00', '#FF9800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="absolute top-0 bottom-0 left-0 right-0"
              />
              <View className="flex-row items-center">
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text className="text-white text-base font-semibold ml-2">Save This Workout Plan</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          loading ? null : (
            <View className="bg-white rounded-2xl p-8 items-center mb-5 shadow-sm">
              <Ionicons name="fitness-outline" size={60} color="#DDDDDD" />
              <Text className="text-gray-500 text-base text-center mt-4">
                Your workout recommendations will appear here
              </Text>
            </View>
          )
        )}
      </ScrollView>
      
      {/* Save Workout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <Text className="text-xl font-bold text-center mb-5 text-gray-800">Save Workout Plan</Text>
            
            <View className="mb-5">
              <Text className="text-sm font-medium mb-2 text-gray-700">Workout Title</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3.5 text-base border border-gray-200"
                placeholder="Enter a name for your workout"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
              />
            </View>
            
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="bg-gray-200 rounded-xl py-3.5 px-5 flex-1 mr-2 items-center"
                onPress={() => {
                  setSaveModalVisible(false);
                  setWorkoutTitle("");
                }}
                disabled={savingWorkout}
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-[#FF6F00] rounded-xl py-3.5 px-5 flex-1 ml-2 items-center"
                onPress={handleSaveWorkout}
                disabled={savingWorkout}
              >
                {savingWorkout ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="font-semibold text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Explore;