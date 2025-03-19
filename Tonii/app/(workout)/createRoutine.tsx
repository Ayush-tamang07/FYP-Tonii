import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
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
  const chest = "https://i.pinimg.com/474x/c9/b4/54/c9b4541a7a7caba5ef28d8e2bc7d8442.jpg"
  const back = "https://i.pinimg.com/474x/de/e7/41/dee741a33bf48089d71ffe5b4355e3ef.jpg"
  const shoulders = "https://i.pinimg.com/474x/9e/c1/04/9ec1042e907e606428e9b08785882fde.jpg"
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg"
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg"
  const core = "https://i.pinimg.com/474x/a5/5f/d1/a55fd1efb160ad91b420113794d478c6.jpg"
  
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/workout")}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Routine</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Routine title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      
      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton
              ]}
              onPress={() => filterByCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}
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
                style={[styles.exerciseItem, isSelected && styles.selectedExercise]}
                onPress={() => toggleSelection(item.id)}
              >
                <Image 
                  source={{ uri: getCategoryImage(item.category, item.image) }} 
                  style={styles.exerciseImage} 
                />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseMuscle}>{item.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(workout)/singleExercise",
                      params: { id: item.id.toString() },
                    })
                  }>
                  <Text style={styles.moreButtonText}>More</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.addButtonText}>
          {saving ? "Saving..." : `Save Routine (${selectedExercises.length})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoutine;

// ✅ Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 16 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    alignItems: "center", 
    paddingVertical: 15
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#000", 
    textAlign: "center", 
    flexGrow: 1 
  },
  input: { 
    backgroundColor: "#F5F5F5", 
    color: "#000", 
    fontSize: 16, 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 10 
  },
  filterContainer: {
    marginVertical: 10
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center'
  },
  activeCategoryButton: {
    backgroundColor: "#FF6909"
  },
  categoryText: {
    color: "#888",
    fontSize: 14
  },
  activeCategoryText: {
    color: "#FFF",
    fontWeight: "bold"
  },
  exerciseItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#ffffff", 
    padding: 15, 
    borderRadius: 12, 
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1
  },
  selectedExercise: { 
    backgroundColor: "#FFF5EE",
  },
  exerciseImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35 
  },
  exerciseInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  exerciseName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#000",
    marginBottom: 5
  },
  exerciseMuscle: { 
    fontSize: 15, 
    color: "#666" 
  },
  moreButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70
  },
  moreButtonText: {
    color: "#555",
    fontSize: 14
  },
  addButton: { 
    backgroundColor: "#FF6909", 
    padding: 16, 
    borderRadius: 25, 
    alignItems: "center", 
    marginVertical: 10
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  }
});