import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import apiHandler from "../../context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  description: string;
}

const StartWorkout = () => {
  const { id } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
          const token = await SecureStore.getItemAsync("AccessToken"); // Retrieve token
        
          if (!token) {
            return { status: 401, message: "Unauthorized: No token found" };
          }
        const response = await apiHandler.get(`/user/workout-plan/${id}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        if (response.data.success) {
          const fetchedExercises = response.data.exercises.map((item: any) => item.exercise);
          setExercises(fetchedExercises);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch exercises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("../(tabs)/workout")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Start Workout</Text>

      {loading && <ActivityIndicator size="large" color="#FF6F00" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <ScrollView style={styles.exerciseContainer}>
          {exercises.map((exerciseItem, index) => (
            <View key={index} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exerciseItem.name}</Text>
              <Text>{exerciseItem.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  exerciseContainer: {
    marginTop: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default StartWorkout;