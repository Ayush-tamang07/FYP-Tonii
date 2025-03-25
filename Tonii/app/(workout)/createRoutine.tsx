import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  Image, Alert, FlatList, ActivityIndicator,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import apiHandler from "@/context/APIHandler";
import * as SecureStore from "expo-secure-store";

interface Exercise {
  id: number;
  name: string;
  category: string;
  image: string;
  exercise: string
}

const CreateRoutine: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Category image URLs
  const chest= "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9OrxMWzC6ARoatL1rrufQg.jpeg"
  const back = "https://i.pinimg.com/474x/de/e7/41/dee741a33bf48089d71ffe5b4355e3ef.jpg"
  const shoulders = "https://i.pinimg.com/736x/06/10/f3/0610f3183ea0d933fabea62bb65e9c4e.jpg"
  // const shoulders = "https://i.pinimg.com/474x/9e/c1/04/9ec1042e907e606428e9b08785882fde.jpg"
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg"
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg"
  const core = "https://st2.depositphotos.com/1726139/5347/i/950/depositphotos_53477943-stock-photo-strong-bodybuilder-with-perfect-abs.jpg"
  // const core = "https://i.pinimg.com/474x/a5/5f/d1/a55fd1efb160ad91b420113794d478c6.jpg"
  
  // Categories for filter
  const categories = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core"];
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await apiHandler.get("/exercise");
        setExercises(response.data.data);
        setFilteredExercises(response.data.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  // Simple filter implementation
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    
    if (category === "All") {
      setFilteredExercises(exercises);
      return;
    }
    
    // Simple filtering by category
    const filter = category.toLowerCase();
    const filtered = exercises.filter(exercise => 
      exercise.category.toLowerCase().includes(filter)
    );
    
    setFilteredExercises(filtered);
  };

  // Get appropriate image based on category
  const getCategoryImage = (category: string, fallbackImage: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('chest')) return chest;
    if (lowerCategory.includes('back')) return back;
    if (lowerCategory.includes('shoulder')) return shoulders;
    if (lowerCategory.includes('leg') || lowerCategory.includes('quad') || lowerCategory.includes('hamstring') || lowerCategory.includes('calf')) return leg;
    if (lowerCategory.includes('arm') || lowerCategory.includes('bicep') || lowerCategory.includes('tricep')) return arms;
    if (lowerCategory.includes('core') || lowerCategory.includes('ab') || lowerCategory.includes('abdominal')) return core;
    return fallbackImage || chest;
  };

  // Toggle Exercise Selection
  const toggleSelection = (exerciseId: number) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(exerciseId)
        ? prevSelected.filter((id) => id !== exerciseId)
        : [...prevSelected, exerciseId]
    );
  };

  // Handle Routine Creation
  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a routine title");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Error", "Please select at least one exercise.");
      return;
    }

    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync("AccessToken");

      // Create workout plan
      const response = await apiHandler.post(
        "/user/workout-plans",
        { name: title },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const workoutPlanId = response.data?.data?.id;
      if (!workoutPlanId) throw new Error("Workout Plan ID missing");

      await addExercisesToWorkout(workoutPlanId);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create workout plan.");
    } finally {
      setSaving(false);
    }
  };

  // Add Exercises to Workout Plan
  const addExercisesToWorkout = async (workoutPlanId: number) => {
    try {
      const token = await SecureStore.getItemAsync("AccessToken");

      const response = await apiHandler.post(
        "/workout-plans/add-exercise",
        { workoutPlanId, exercises: selectedExercises },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Workout routine and exercises saved!");
        setTitle("");
        setSelectedExercises([]);
        router.push("../(tabs)/workout");
      } else {
        Alert.alert("Error", "Failed to add exercises.");
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not add exercises to workout plan.");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-start items-center py-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/workout")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black text-center flex-grow">Create Routine</Text>
      </View>

      <TextInput
        className="bg-gray-100 text-black text-base p-4 rounded-lg my-2.5"
        placeholder="Routine title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      
      {/* Category Filter */}
      <View className="my-2.5">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-5 py-2.5 rounded-full mr-2.5 min-w-20 items-center ${
                activeCategory === category ? 'bg-[#FF6909]' : 'bg-gray-100'
              }`}
              onPress={() => filterByCategory(category)}
            >
              <Text 
                className={`${
                  activeCategory === category ? 'text-white font-bold' : 'text-gray-500'
                } text-sm`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.id);
            return (
              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl my-1.5 shadow-sm ${
                  isSelected ? 'bg-[#FFF5EE]' : 'bg-white'
                }`}
                onPress={() => toggleSelection(item.id)}
              >
                <Image 
                  source={{ uri: getCategoryImage(item.category, item.image) }} 
                  className="w-[70px] h-[70px] rounded-full" 
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-black mb-1">{item.name}</Text>
                  <Text className="text-base text-gray-500">{item.category}</Text>
                </View>
                <TouchableOpacity
                  className="bg-gray-100 px-4 py-2 rounded-full items-center justify-center min-w-[70px]"
                  onPress={() =>
                    router.push({
                      pathname: "/(workout)/singleExercise",
                      params: { id: item.id.toString() },
                    })
                  }>
                  <Text className="text-gray-600 text-sm">More</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity 
        className="bg-[#FF6909] p-4 rounded-3xl items-center my-2.5" 
        onPress={handleSave} 
        disabled={saving}
      >
        <Text className="text-white text-lg font-bold">
          {saving ? "Saving..." : `Save Routine (${selectedExercises.length})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoutine;