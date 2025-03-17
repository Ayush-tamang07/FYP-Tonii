import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, FlatList, ActivityIndicator,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import apiHandler from "@/context/APIHandler";
import * as SecureStore from "expo-secure-store";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  image: string;
  exercise: string
}

const CreateRoutine: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await apiHandler.get("/exercise");
        setExercises(response.data.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

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
        {/* <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={styles.saveText}>
            {saving ? "Saving..." : `Save (${selectedExercises.length})`}
          </Text>
        </TouchableOpacity> */}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Routine title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.exerciseItem, isSelected && styles.selectedExercise]}
                onPress={() => toggleSelection(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.exerciseImage} />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseMuscle}>{item.muscle}</Text>
                </View>
                <TouchableOpacity
                  // style={}
                  onPress={() =>
                    router.push({
                      pathname: "/(workout)/singleExercise",
                      // params: { id: exercise.id },
                      params: { id: item.id.toString() },
                    })
                  }>
                  <Text>More</Text>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: 15, width: "100%" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000", textAlign: "center", flexGrow: 1 },
  saveText: { color: "#3498db", fontSize: 16, fontWeight: "bold" },
  input: { backgroundColor: "#F5F5F5", color: "#000", fontSize: 16, padding: 15, borderRadius: 8, marginVertical: 10 },
  exerciseItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9f9f9", padding: 10, borderRadius: 10, marginVertical: 5 },
  selectedExercise: { backgroundColor: "#FFD8B5" },
  exerciseImage: { width: 50, height: 50, borderRadius: 25 },
  exerciseInfo: { flex: 1, marginLeft: 10 },
  addButton: { backgroundColor: "#FF6909", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  exerciseMuscle: { fontSize: 14, color: "#666" },
});
