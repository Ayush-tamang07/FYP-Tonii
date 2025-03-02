import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "../../context/APIHandler"; // Import the axios instance

interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  description?: string;
}

const SelectExercise = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/exercise"); // Fetch exercises from backend
      setExercises(response.data.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectExercise = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      onPress={() => toggleSelectExercise(item.id)}
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: selectedExercises.includes(item.id) ? "#4CAF50" : "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
      <Text style={{ color: "#666" }}>{item.muscleGroup}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Select Exercises</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList data={exercises} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
      )}
    </View>
  );
};

export default SelectExercise;
