import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import apiHandler from "../../context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  image?: string;
}
interface WorkoutPlan{
  id: number;
  WorkoutName: string;
}

const EditWorkoutPlan = () => {
  const { id } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutName, setWorkoutName] = useState("Workout Plan");

  // Category image URLs
  const chest = "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9OrxMWzC6ARoatL1rrufQg.jpeg";
  const back = "https://www.shutterstock.com/image-photo/rear-view-athletic-man-showing-600w-316147079.jpg";
  const shoulders = "https://www.madscientistofmuscle.com/1-exercises/1-muscle-anatomy/graphics/deltoids.jpg";
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg";
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg";
  const core = "https://st2.depositphotos.com/1726139/5347/i/950/depositphotos_53477943-stock-photo-strong-bodybuilder-with-perfect-abs.jpg";

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync("AccessToken");
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        // Try to fetch exercises directly without fetching plan details first
        // This approach matches how it's done in StartWorkout
        const response = await apiHandler.get(`/user/workout-plan/${id}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const fetchedExercises = response.data.exercises.map((item: any) => item.exercise);
          setExercises(fetchedExercises);
        } else {
          setError(response.data.message || "Failed to fetch exercises");
        }
      } catch (err: any) {
        console.error("Error fetching workout details:", err);
        
        // Check if it's a 404 error specifically
        if (err.response && err.response.status === 404) {
          setError("Workout plan not found. It may have been deleted.");
        } else {
          setError('Failed to load workout plan exercises. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [id]);

  // Get appropriate image based on category
  const getCategoryImage = (category: string, fallbackImage?: string): string => {
    if (!category) return chest; // Default fallback

    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('chest')) return chest;
    if (lowerCategory.includes('back')) return back;
    if (lowerCategory.includes('shoulder')) return shoulders;
    if (lowerCategory.includes('leg') || lowerCategory.includes('quad') || lowerCategory.includes('hamstring') || lowerCategory.includes('calf')) return leg;
    if (lowerCategory.includes('arm') || lowerCategory.includes('bicep') || lowerCategory.includes('tricep')) return arms;
    if (lowerCategory.includes('core') || lowerCategory.includes('ab') || lowerCategory.includes('abdominal')) return core;
    return fallbackImage || chest;
  };

  const removeExercise = (exerciseId: number) => {
    setExercises(prevExercises => prevExercises.filter(ex => ex.id !== exerciseId));
  };

  const saveChanges = async () => {
    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const exerciseIds = exercises.map(ex => ex.id);

      const response = await apiHandler.put(
        `/user/workout-plan/${id}/exercises`, 
        { exercises: exerciseIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Workout plan updated successfully", [
          { text: "OK", onPress: () => router.push("/(tabs)/workout") }
        ]);
      } else {
        Alert.alert("Error", response.data.message || "Failed to update workout plan");
      }
    } catch (error: any) {
      console.error("Error saving workout plan:", error);
      
      // More specific error message based on the response
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Workout plan not found. It may have been deleted.");
      } else {
        Alert.alert("Error", "Failed to save changes to workout plan");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white flex-row items-center p-5 shadow-sm">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/workout")}
          className="w-10 h-10 justify-center items-center rounded-full"
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-center text-xl flex-1 font-bold text-[#333]">Edit Workout</Text>
        <View className="w-10" />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6F00" />
          <Text className="mt-3 text-[#555] text-base">Loading workout plan...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-5">
          <MaterialIcons name="error-outline" size={40} color="#dc3545" />
          <Text className="text-[#dc3545] text-center mt-3 text-base mb-5">{error}</Text>
          <TouchableOpacity
            className="bg-[#6c757d] px-5 py-3 rounded-lg"
            onPress={() => router.push("/(tabs)/workout")}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="p-4 bg-white mt-2 mx-4 rounded-lg shadow-sm">
            <Text className="text-lg font-bold text-[#333]">{workoutName}</Text>
          </View>

          <TouchableOpacity 
            className="p-4 bg-[#FF6F00] mt-4 mx-4 rounded-lg shadow-sm flex-row items-center justify-center"
            onPress={() => router.push({
              pathname: "/(workout)/AddExerciseToRoutine ",
              params: { workoutPlanId: id }
            })}
            
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Exercise</Text>
          </TouchableOpacity>

          <View className="p-4">
            <Text className="text-lg font-semibold text-[#444]">
              Exercises ({exercises.length})
            </Text>
          </View>

          <ScrollView className="flex-1 px-4">
            {exercises.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-[#888] text-base">No exercises in this workout plan</Text>
                <TouchableOpacity 
                  className="mt-4 p-3 bg-[#f0f0f0] rounded-lg"
                  onPress={() => router.push({
                    pathname: "/(workout)/addExercise",
                    params: { workoutPlanId: id }
                  })}
                >
                  <Text className="text-[#555]">Add Exercises</Text>
                </TouchableOpacity>
              </View>
            ) : (
              exercises.map((exercise) => (
                <View
                  key={exercise.id}
                  className="flex-row items-center bg-white p-4 rounded-xl my-1.5 shadow-sm"
                >
                  <Image
                    source={{ uri: getCategoryImage(exercise.category, exercise.image) }}
                    className="w-[60px] h-[60px] rounded-full"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-base font-bold text-black mb-0.5">
                      {exercise.name}
                    </Text>
                    {exercise.category && (
                      <Text className="text-sm text-[#666] mb-0.5">{exercise.category}</Text>
                    )}
                    {exercise.description && (
                      <Text className="text-xs text-[#888]" numberOfLines={2}>
                        {exercise.description}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row items-center ml-2.5">
                    <TouchableOpacity
                      className="bg-[#F0F0F0] p-2 rounded-full items-center justify-center mr-2"
                      onPress={() =>
                        router.push({
                          pathname: "/(workout)/singleExercise",
                          params: { id: exercise.id.toString() },
                        })
                      }
                    >
                      <MaterialIcons name="info-outline" size={20} color="#3498db" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#F0F0F0] p-2 rounded-full items-center justify-center"
                      onPress={() => removeExercise(exercise.id)}
                    >
                      <MaterialIcons name="delete-outline" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View className="h-24" />
          </ScrollView>

          {exercises.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e0e0e0]">
              <TouchableOpacity
                className="bg-[#4CAF50] p-4 rounded-xl shadow-sm items-center"
                onPress={saveChanges}
              >
                <Text className="text-white font-b old text-base">Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default EditWorkoutPlan;