import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  FlatList, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import apiHandler from "@/context/APIHandler";
import { Ionicons } from "@expo/vector-icons";

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
  const [error, setError] = useState("");

  // Predefined options for dropdown selections
  const goalOptions = ["lose weight", "build muscle", "strength", "endurance"];
  const experienceOptions = ["beginner", "intermediate", "advanced"];
  const equipmentOptions = ["none", "dumbbell", "barbell", "machine", "cable", "bodyweight"];
  const muscleOptions = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abs", "forearms", "calves"];

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
        setExercises(response.data.suggestions);
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white py-4 px-5 flex-row items-center border-b border-gray-200">
        <Ionicons name="fitness-outline" size={24} color="#4a90e2" />
        <Text className="text-xl font-bold text-gray-800 ml-2">Explore Workouts</Text>
      </View>
      
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-2xl font-bold mb-5 text-center text-gray-800">Workout Planner</Text>
        
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold mb-4 text-gray-800">Your Details</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Age</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-50"
              placeholder="Enter your age"
              keyboardType="numeric"
              value={userDetails.age.toString()}
              onChangeText={(text) => handleChange("age", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Gender</Text>
            <View className="flex-row flex-wrap">
              {["male", "female", "other"].map(option => (
                <TouchableOpacity
                  key={`gender-${option}`}
                  className={`border rounded-lg px-3 py-2 mr-2 mb-2 ${
                    userDetails.gender === option 
                      ? 'bg-[#4a90e2] border-[#4a90e2]' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onPress={() => handleChange("gender", option, "details")}
                >
                  <Text className={`${
                    userDetails.gender === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Height (cm)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-50"
              placeholder="Enter your height"
              keyboardType="numeric"
              value={userDetails.height.toString()}
              onChangeText={(text) => handleChange("height", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Weight (kg)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-50"
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={userDetails.weight.toString()}
              onChangeText={(text) => handleChange("weight", text ? Number(text) : "", "details")}
            />
          </View>
        </View>
        
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold mb-4 text-gray-800">Workout Preferences</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Goal</Text>
            <View className="flex-row flex-wrap">
              {goalOptions.map(option => (
                <TouchableOpacity
                  key={`goal-${option}`}
                  className={`border rounded-lg px-3 py-2 mr-2 mb-2 ${
                    userPreferences.goal === option 
                      ? 'bg-[#4a90e2] border-[#4a90e2]' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onPress={() => handleChange("goal", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.goal === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Experience Level</Text>
            <View className="flex-row flex-wrap">
              {experienceOptions.map(option => (
                <TouchableOpacity
                  key={`experience-${option}`}
                  className={`border rounded-lg px-3 py-2 mr-2 mb-2 ${
                    userPreferences.experience === option 
                      ? 'bg-[#4a90e2] border-[#4a90e2]' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onPress={() => handleChange("experience", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.experience === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Equipment</Text>
            <View className="flex-row flex-wrap">
              {equipmentOptions.map(option => (
                <TouchableOpacity
                  key={`equipment-${option}`}
                  className={`border rounded-lg px-3 py-2 mr-2 mb-2 ${
                    userPreferences.equipment === option 
                      ? 'bg-[#4a90e2] border-[#4a90e2]' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onPress={() => handleChange("equipment", option, "preferences")}
                >
                  <Text className={`${
                    userPreferences.equipment === option 
                      ? 'text-white font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold mb-1.5 text-gray-600">Target Muscles</Text>
            <View className="flex-row flex-wrap">
              {muscleOptions.map(muscle => (
                <TouchableOpacity
                  key={`muscle-${muscle}`}
                  className={`border rounded-lg px-3 py-2 mr-2 mb-2 ${
                    userPreferences.muscle.includes(muscle) 
                      ? 'bg-[#4a90e2] border-[#4a90e2]' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  onPress={() => handleMuscleSelection(muscle)}
                >
                  <Text className={`${
                    userPreferences.muscle.includes(muscle) 
                      ? 'text-white font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {muscle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {userPreferences.muscle ? (
              <Text className="mt-2 text-sm text-[#4a90e2] font-medium">
                Selected: {userPreferences.muscle}
              </Text>
            ) : (
              <Text className="mt-2 text-sm text-gray-400 italic">
                Select one or more muscle groups
              </Text>
            )}
          </View>
        </View>
        
        {error ? <Text className="text-red-500 mb-4 text-sm text-center">{error}</Text> : null}
        
        <TouchableOpacity 
          className="bg-[#4a90e2] rounded-lg py-3.5 items-center mt-2 mb-6"
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
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-gray-800">Your Personalized Workout</Text>
            <FlatList
              data={exercises}
              keyExtractor={(item, index) => `exercise-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="border border-gray-200 rounded-lg p-3 mb-2.5 bg-gray-50">
                  <Text className="text-base font-bold mb-2 text-gray-800">{item.name}</Text>
                  <View className="gap-1">
                    <Text className="text-sm text-gray-600">Muscle: {item.muscle}</Text>
                    <Text className="text-sm text-gray-600">Equipment: {item.equipment}</Text>
                    <Text className="text-sm text-gray-600">Difficulty: {item.difficulty}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          loading ? null : (
            <View className="bg-white rounded-xl p-8 items-center mb-4 shadow-sm">
              <Text className="text-gray-400 text-base text-center">
                Your workout recommendations will appear here
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;