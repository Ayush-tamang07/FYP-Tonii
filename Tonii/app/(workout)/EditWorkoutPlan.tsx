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
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import apiHandler from "../../context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  image?: string;
}

const EditWorkoutPlan = () => {
  const { id } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [initialExerciseIds, setInitialExerciseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [workoutName, setWorkoutName] = useState("Workout Plan");

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

        const response = await apiHandler.get(`/user/workout-plan/${id}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const fetchedExercises = response.data.exercises.map((item: any) => item.exercise);
          setExercises(fetchedExercises);
          setInitialExerciseIds(fetchedExercises.map((ex: Exercise) => ex.id));
        } else {
          setError(response.data.message || "Failed to fetch exercises");
        }
      } catch (err: any) {
        console.error("Error fetching workout details:", err);
        if (err.response?.status === 404) {
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

  const getCategoryImage = (category: string, fallbackImage?: string): string => {
    if (!category) return chest;
    const lower = category.toLowerCase();
    if (lower.includes('chest')) return chest;
    if (lower.includes('back')) return back;
    if (lower.includes('shoulder')) return shoulders;
    if (lower.includes('leg') || lower.includes('quad') || lower.includes('hamstring') || lower.includes('calf')) return leg;
    if (lower.includes('arm') || lower.includes('bicep') || lower.includes('tricep')) return arms;
    if (lower.includes('core') || lower.includes('ab')) return core;
    return fallbackImage || chest;
  };

  const removeExercise = (exerciseId: number) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const saveChanges = async () => {
    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const currentIds = exercises.map(ex => ex.id);
      const add = currentIds.filter(id => !initialExerciseIds.includes(id));
      const remove = initialExerciseIds.filter(id => !currentIds.includes(id));

      const response = await apiHandler.put(
        `/user/workout-plan/${id}/exercises`,
        { add, remove },
        {
          headers: { Authorization: `Bearer ${token}` },
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
      Alert.alert("Error", "Failed to save changes to workout plan");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white flex-row items-center p-5 shadow-sm">
        <TouchableOpacity onPress={() => router.push("/(tabs)/workout")} className="w-10 h-10 justify-center items-center rounded-full">
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
          <TouchableOpacity className="bg-[#6c757d] px-5 py-3 rounded-lg" onPress={() => router.push("/(tabs)/workout")}>
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* <View className="p-4 bg-white mt-2 mx-4 rounded-lg shadow-sm">
            <Text className="text-lg font-bold text-[#333]">{workoutName}</Text>
          </View> */}

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
                <Text className="text-white font-bold text-base">Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default EditWorkoutPlan;
