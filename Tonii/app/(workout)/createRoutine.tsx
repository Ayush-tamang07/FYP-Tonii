import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, Alert, FlatList, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Restored Navigation
import apiHandler from "@/context/APIHandler";
import * as SecureStore from "expo-secure-store";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  image: string;
}

const CreateRoutine: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch exercises from API
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

  // Toggle exercise selection
  const toggleSelection = (exerciseId: number) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(exerciseId)
        ? prevSelected.filter((id) => id !== exerciseId)
        : [...prevSelected, exerciseId]
    );
  };

  // Handle Save Routine & Exercises Together
  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a routine title");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Error", "Please select at least one exercise.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      const result = await apiHandler.post(
        "/user/workout-plans",
        {
          name: title,
          exercises: selectedExercises, // Send exercises with routine
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status === 201) {
        Alert.alert("Success", "Workout routine created successfully!");
        setTitle("");
        setSelectedExercises([]);
        router.push("../(tabs)/workout"); // Navigate back after saving
      }
    } catch (error) {
      console.log("Error saving routine:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Icon & Save */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("../(tabs)/workout")}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Routine</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save ({selectedExercises.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Routine Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Routine title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      {/* Filter Buttons */}
      <View style={styles.filterButtons}>
        <TouchableOpacity style={[styles.filterButton, { flex: 1 }]}>
          <Text style={styles.filterText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { flex: 1 }]}>
          <Text style={styles.filterText}>All Muscles</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6909" style={{ marginTop: 20 }} />
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
                <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]} />
                <Image source={{ uri: item.image }} style={styles.exerciseImage} />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseMuscle}>{item.muscle}</Text>
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

      {/* {selectedExercises.length > 0 && (
        <Text style={styles.selectedText}>
          Selected Exercises: {selectedExercises.length}
        </Text>
      )} */}

      {/* Save Routine Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Save Routine ({selectedExercises.length})</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoutine;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  saveText: { color: "#3498db", fontSize: 16, fontWeight: "bold" },
  input: { backgroundColor: "#F5F5F5", color: "#000", fontSize: 16, padding: 15, borderRadius: 8, marginVertical: 10 },
  exerciseItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9f9f9", padding: 10, borderRadius: 10, marginVertical: 5 },
  selectedExercise: { backgroundColor: "#FFD8B5" },
  selectionIndicator: { width: 4, height: "100%", backgroundColor: "transparent", marginRight: 10 },
  selectedIndicator: { backgroundColor: "#FF6909" },
  exerciseImage: { width: 50, height: 50, borderRadius: 25 },
  exerciseInfo: { flex: 1, marginLeft: 10 },
  exerciseName: { fontSize: 18, color: "#000" },
  exerciseMuscle: { fontSize: 14, color: "#666" },
  addButton: { backgroundColor: "#FF6909", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  selectedText: { fontSize: 16, fontWeight: "bold", color: "#FF6909", textAlign: "center", marginVertical: 10 },
  filterButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 10 },
  filterButton: { backgroundColor: "#e0e0e0", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  filterText: { fontSize: 16, color: "#000", textAlign: "center" },
});
