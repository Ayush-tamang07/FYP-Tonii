import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import apiHandler from "@/context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  category: string;
  image?: string;
}

const AddExerciseToRoutine: React.FC = () => {
  const { workoutPlanId } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const chest = "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9OrxMWzC6ARoatL1rrufQg.jpeg";
  const back = "https://i.pinimg.com/474x/de/e7/41/dee741a33bf48089d71ffe5b4355e3ef.jpg";
  const shoulders = "https://i.pinimg.com/736x/06/10/f3/0610f3183ea0d933fabea62bb65e9c4e.jpg";
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg";
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg";
  const core = "https://st2.depositphotos.com/1726139/5347/i/950/depositphotos_53477943-stock-photo-strong-bodybuilder-with-perfect-abs.jpg";

  const getCategoryImage = (category: string, fallbackImage?: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("chest")) return chest;
    if (lowerCategory.includes("back")) return back;
    if (lowerCategory.includes("shoulder")) return shoulders;
    if (lowerCategory.includes("leg") || lowerCategory.includes("quad") || lowerCategory.includes("hamstring") || lowerCategory.includes("calf")) return leg;
    if (lowerCategory.includes("arm") || lowerCategory.includes("bicep") || lowerCategory.includes("tricep")) return arms;
    if (lowerCategory.includes("core") || lowerCategory.includes("ab")) return core;
    return fallbackImage || chest;
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await apiHandler.get("/exercise");
        setExercises(response.data.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleSelection = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAddExercises = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert("Please select at least one exercise to add.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (!token) {
        Alert.alert("Unauthorized", "No access token found.");
        return;
      }

      setSaving(true);

      const response = await apiHandler.put(
        `/user/workout-plan/${workoutPlanId}/exercises`,
        { add: selectedExercises },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Exercises added to workout plan", [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/(workout)/EditWorkoutPlan",
                  params: { id: String(workoutPlanId) },
                }),
            },
          ]);
          
      } else {
        Alert.alert("Error", response.data.message || "Failed to update workout plan.");
      }
    } catch (error) {
      Alert.alert("Error", "Server error while adding exercises.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Add Exercises</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6F00" />
      ) : (
        <ScrollView>
          {exercises.map((exercise) => {
            const isSelected = selectedExercises.includes(exercise.id);
            return (
              <TouchableOpacity
                key={exercise.id}
                className={`flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm ${
                  isSelected ? "border-2 border-[#FF6909]" : "border border-gray-200"
                }`}
                onPress={() => toggleSelection(exercise.id)}
              >
                <Image
                  source={{ uri: getCategoryImage(exercise.category, exercise.image) }}
                  className="w-[60px] h-[60px] rounded-full"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-base font-bold text-black">{exercise.name}</Text>
                  <Text className="text-sm text-gray-500">{exercise.category}</Text>
                </View>
                {isSelected && <MaterialIcons name="check-circle" size={24} color="#FF6909" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={handleAddExercises}
        disabled={saving}
        className="bg-[#FF6909] py-4 rounded-2xl mt-5 items-center justify-center"
      >
        <Text className="text-white font-bold text-lg">
          {saving ? "Saving..." : `Add (${selectedExercises.length}) to Plan`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddExerciseToRoutine;
