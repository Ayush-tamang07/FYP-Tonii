import React, { useState, useEffect } from "react";
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
import { router } from "expo-router";
import { fetchUserDetails } from '../../context/userAPI';

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6F00" />
          <Text className="mt-2.5 text-gray-600 text-base">Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="px-4 pt-3 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/workout")} 
          className="p-2 absolute left-2 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black text-center flex-1">Generate Workout</Text>
      </View>
      
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8">
        {/* User Details Section */}
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <Text className="text-base font-bold mb-3 text-black">Your Details</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Age</Text>
            <TextInput
              className="bg-white rounded-lg px-3 py-2.5 text-base"
              placeholder="Enter your age"
              keyboardType="numeric"
              value={userDetails.age.toString()}
              onChangeText={(text) => handleChange("age", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Gender</Text>
            <View className="flex-row mb-1">
              {["male", "female"].map(option => (
                <TouchableOpacity
                  key={`gender-${option}`}
                  className={`px-4 py-2 mr-2 rounded-lg ${
                    userDetails.gender === option 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-white'
                  }`}
                  onPress={() => handleChange("gender", option, "details")}
                >
                  <Text className={`${
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
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Height (cm)</Text>
            <TextInput
              className="bg-white rounded-lg px-3 py-2.5 text-base"
              placeholder="Enter your height"
              keyboardType="numeric"
              value={userDetails.height.toString()}
              onChangeText={(text) => handleChange("height", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View className="mb-1">
            <Text className="text-sm font-medium mb-1 text-gray-600">Weight (kg)</Text>
            <TextInput
              className="bg-white rounded-lg px-3 py-2.5 text-base"
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={userDetails.weight.toString()}
              onChangeText={(text) => handleChange("weight", text ? Number(text) : "", "details")}
            />
          </View>
        </View>
        
        {/* Workout Preferences Section */}
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <Text className="text-base font-bold mb-3 text-black">Workout Preferences</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Goal</Text>
            <View className="flex-row flex-wrap">
              {goalOptions.map(option => (
                <TouchableOpacity
                  key={`goal-${option}`}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg ${
                    userPreferences.goal === option 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-white'
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
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Experience Level</Text>
            <View className="flex-row flex-wrap">
              {experienceOptions.map(option => (
                <TouchableOpacity
                  key={`experience-${option}`}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg ${
                    userPreferences.experience === option 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-white'
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
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1 text-gray-600">Equipment</Text>
            <View className="flex-row flex-wrap">
              {equipmentOptions.map(option => (
                <TouchableOpacity
                  key={`equipment-${option}`}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg ${
                    userPreferences.equipment === option 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-white'
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
          
          <View className="mb-1">
            <Text className="text-sm font-medium mb-1 text-gray-600">Target Muscles</Text>
            <View className="flex-row flex-wrap">
              {muscleOptions.map(muscle => (
                <TouchableOpacity
                  key={`muscle-${muscle}`}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg ${
                    userPreferences.muscle.includes(muscle) 
                      ? 'bg-[#FF6F00]' 
                      : 'bg-white'
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
              <Text className="mt-2 text-sm text-gray-600">
                Selected: {userPreferences.muscle.split(',').map(m => m.trim().charAt(0).toUpperCase() + m.trim().slice(1)).join(', ')}
              </Text>
            ) : (
              <Text className="mt-2 text-sm text-gray-500 italic">
                Select one or more muscle groups
              </Text>
            )}
          </View>
        </View>
        
        {error ? <Text className="text-red-500 mb-4 text-sm text-center">{error}</Text> : null}
        
        <TouchableOpacity 
          className="bg-[#FF6F00] rounded-xl py-3.5 items-center mb-6"
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
          <View className="bg-gray-100 rounded-xl p-4 mb-4">
            <Text className="text-base font-bold mb-3 text-black">Your Personalized Workout</Text>
            <FlatList
              data={exercises}
              keyExtractor={(item, index) => `exercise-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-lg p-4 mb-2.5">
                  <Text className="text-base font-bold mb-2 text-black">{item.name}</Text>
                  <View className="mb-2">
                    <Text className="text-sm text-gray-600">Muscle: {item.muscle}</Text>
                    <Text className="text-sm text-gray-600">Equipment: {item.equipment}</Text>
                    <Text className="text-sm text-gray-600">Difficulty: {item.difficulty}</Text>
                  </View>
                  {/* <TouchableOpacity className="bg-[#FF6F00] rounded-lg py-2.5 items-center mt-1">
                    <Text className="text-white font-medium">Start Exercise</Text>
                  </TouchableOpacity> */}
                </View>
              )}
            />
          </View>
        ) : (
          loading ? null : (
            <View className="bg-gray-100 rounded-xl p-6 items-center mb-4">
              <Text className="text-gray-500 text-base text-center mb-3">
                Your workout recommendations will appear here
              </Text>
              <Ionicons name="fitness-outline" size={48} color="#DDDDDD" />
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;