import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import apiHandler from '@/context/APIHandler';

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  image: string;
}

const AddExercise: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await apiHandler.get("/exercise"); // API call to backend
        setExercises(response.data.data); // Set exercises
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Toggle exercise selection
  const toggleSelection = (exerciseId: number) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(exerciseId) ? prevSelected.filter((id) => id !== exerciseId) : [...prevSelected, exerciseId]
    );
  };

  // Send selected exercises to backend
  const addToWorkoutPlan = async () => {
    if (selectedExercises.length === 0) {
      alert("Please select at least one exercise.");
      return;
    }

    try {
      const response = await apiHandler.post("/workout-plan/add-exercises", {
        workoutPlanId: 1, // Replace with actual workout plan ID
        exercises: selectedExercises,
      });

      if (response.data.success) {
        alert("Exercises added successfully!");
        router.push("/(workout)/createRoutine"); // Navigate back
      } else {
        alert("Failed to add exercises.");
      }
    } catch (error) {
      console.error("Error adding exercises:", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-row justify-between items-center py-2.5">
        <TouchableOpacity onPress={() => router.push("/(workout)/createRoutine")}>
          <Text className="text-[#FF6909] text-lg">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Add Exercise</Text>
        <TouchableOpacity onPress={addToWorkoutPlan}>
          <Text className="text-[#FF6909] text-lg">Create</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-between mb-2.5 gap-2.5">
        <TouchableOpacity className="flex-1 bg-gray-200 py-2.5 px-4 rounded-lg">
          <Text className="text-base text-black text-center">All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-gray-200 py-2.5 px-4 rounded-lg">
          <Text className="text-base text-black text-center">All Muscles</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6909" className="mt-5" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.id);
            return (
              <TouchableOpacity
                className={`flex-row items-center ${isSelected ? 'bg-[#FFD8B5]' : 'bg-gray-50'} p-2.5 rounded-lg my-1.5`}
                onPress={() => toggleSelection(item.id)}
              >
                <View className={`w-1 h-full ${isSelected ? 'bg-[#FF6909]' : 'bg-transparent'} mr-2.5`} />
                <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full" />
                <View className="flex-1 ml-2.5">
                  <Text className="text-lg text-black">{item.name}</Text>
                  <Text className="text-sm text-gray-500">{item.muscle}</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color="#FF6909" />
                ) : (
                  <Ionicons name="arrow-forward" size={20} color="#888" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selectedExercises.length > 0 && (
        <TouchableOpacity className="bg-[#FF6909] p-4 rounded-lg items-center mt-2.5" onPress={addToWorkoutPlan}>
          <Text className="text-white text-lg font-bold">Add {selectedExercises.length} exercises</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddExercise;