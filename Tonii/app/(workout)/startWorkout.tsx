import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  
  // Timer states
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Checkbox states
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync("AccessToken");
        if (!token) {
          return { status: 401, message: "Unauthorized: No token found" };
        }
        const response = await apiHandler.get(`/user/workout-plan/${id}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Function to start the workout
  const startWorkout = () => {
    setIsWorkoutActive(true);
    setElapsedTime(0);
    
    const newTimer = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
    
    setTimer(newTimer);
  };

  // Function to stop the workout
  const stopWorkout = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsWorkoutActive(false);
  };

  // Function to toggle exercise completion
  const toggleExerciseCompletion = (exerciseId: number) => {
    setCompletedExercises((prevState) => ({
      ...prevState,
      [exerciseId]: !prevState[exerciseId],
    }));
  };

  // Check if all exercises are completed
  const allExercisesCompleted = exercises.length > 0 && exercises.every(exercise => completedExercises[exercise.id]);

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/(tabs)/workout")}>
                <Ionicons name="arrow-back" size={24} color="#3498db" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Start Routine</Text>
            </View>

      {loading && <ActivityIndicator size="large" color="#FF6F00" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <>
          <ScrollView style={styles.exerciseContainer}>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                onPress={() => toggleExerciseCompletion(exercise.id)}
              >
                {/* Checkbox */}
                <Ionicons
                  name={completedExercises[exercise.id] ? "checkbox-outline" : "square-outline"}
                  size={24}
                  color={completedExercises[exercise.id] ? "#28a745" : "#888"}
                />
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Timer Display */}
          {isWorkoutActive && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Workout Time: {formatTime(elapsedTime)}</Text>
            </View>
          )}

          {/* Start/Stop Workout Button */}
          <TouchableOpacity 
            style={isWorkoutActive ? styles.stopButton : styles.startButton} 
            onPress={isWorkoutActive ? stopWorkout : startWorkout}
          >
            <Text style={styles.buttonText}>{isWorkoutActive ? "Stop Workout" : "Start Workout"}</Text>
          </TouchableOpacity>

          {/* Finish Workout Button (Visible only when all exercises are completed) */}
          {allExercisesCompleted && (
            <TouchableOpacity style={styles.finishButton} onPress={stopWorkout}>
              <Text style={styles.buttonText}>Finish Workout</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  exerciseDetails: {
    marginLeft: 10,
    flex: 1,
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
  timerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  stopButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    flexDirection: "row",
    justifyContent: "center", // Center content horizontally
    alignItems: "center",
    paddingVertical: 15,
    width: "100%", // Ensure it takes full width of the screen
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center", // Align text in the center
    flexGrow: 1, // Takes up available space
  },
});

export default StartWorkout;
