import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={() => router.push("/(workout)/createRoutine")}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Exercise</Text>
        <TouchableOpacity onPress={addToWorkoutPlan}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterButtons}>
        <TouchableOpacity style={[styles.filterButton, { flex: 1 }]}>
          <Text style={styles.filterText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { flex: 1 }]}>
          <Text style={styles.filterText}>All Muscles</Text>
        </TouchableOpacity>
      </View>

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

      {selectedExercises.length > 0 && (
        <TouchableOpacity style={styles.addButton} onPress={addToWorkoutPlan}>
          <Text style={styles.addButtonText}>Add {selectedExercises.length} exercises</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  topButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: '#FF6909', fontSize: 18 },
  createText: { color: '#FF6909', fontSize: 18 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginVertical: 5 },
  selectedExercise: { backgroundColor: '#FFD8B5' },
  selectionIndicator: { width: 4, height: '100%', backgroundColor: 'transparent', marginRight: 10 },
  selectedIndicator: { backgroundColor: '#FF6909' },
  exerciseImage: { width: 50, height: 50, borderRadius: 25 },
  exerciseInfo: { flex: 1, marginLeft: 10 },
  exerciseName: { fontSize: 18, color: '#000' },
  exerciseMuscle: { fontSize: 14, color: '#666' },
  addButton: { backgroundColor: '#FF6909', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  filterText: {
    fontSize: 16,
    color: '#000', 
    alignSelf: 'center'
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10 // Adds spacing between buttons
  },
});

export default AddExercise;
