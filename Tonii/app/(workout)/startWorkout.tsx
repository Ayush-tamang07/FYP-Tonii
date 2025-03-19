import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
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

  // Calculate workout progress percentage
  const calculateProgress = () => {
    if (exercises.length === 0) return 0;
    const completedCount = exercises.filter(ex => completedExercises[ex.id]).length;
    return (completedCount / exercises.length) * 100;
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push("/(tabs)/workout")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Routine</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text style={styles.loadingText}>Loading exercises...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={40} color="#dc3545" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => router.push("/(tabs)/workout")}
            >
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${calculateProgress()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(calculateProgress())}% Complete
              </Text>
            </View>

            {/* Timer Display */}
            {isWorkoutActive && (
              <View style={styles.timerContainer}>
                <FontAwesome5 name="stopwatch" size={24} color="#FF6F00" />
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              Exercises ({exercises.filter(ex => completedExercises[ex.id]).length}/{exercises.length})
            </Text>

            <ScrollView 
              style={styles.exerciseContainer}
              showsVerticalScrollIndicator={false}
            >
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.exerciseCard,
                    completedExercises[exercise.id] && styles.completedExerciseCard
                  ]}
                  onPress={() => toggleExerciseCompletion(exercise.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox, 
                      completedExercises[exercise.id] && styles.checkboxChecked
                    ]}>
                      {completedExercises[exercise.id] && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <Text style={[
                      styles.exerciseName,
                      completedExercises[exercise.id] && styles.completedExerciseName
                    ]}>
                      {exercise.name}
                    </Text>
                    {exercise.description && (
                      <Text style={styles.exerciseDescription} numberOfLines={2}>
                        {exercise.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <View style={styles.spacer} />
            </ScrollView>

            <View style={styles.buttonContainer}>
              {/* Start/Stop Workout Button */}
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  isWorkoutActive ? styles.stopButton : styles.startButton
                ]} 
                onPress={isWorkoutActive ? stopWorkout : startWorkout}
              >
                <FontAwesome5 
                  name={isWorkoutActive ? "stop-circle" : "play-circle"} 
                  size={20} 
                  color="#fff" 
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {isWorkoutActive ? "Pause Workout" : "Start Workout"}
                </Text>
              </TouchableOpacity>

              {/* Finish Workout Button */}
              {allExercisesCompleted && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.finishButton]} 
                  onPress={() => {
                    stopWorkout();
                    // Navigate back or to a completion screen
                    router.push("/(tabs)/workout");
                  }}
                >
                  <MaterialIcons 
                    name="done-all" 
                    size={20} 
                    color="#fff" 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Complete Workout</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#3498db',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flexGrow: 1,
    marginRight: 40, // Offset for the back button to center the title
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    color: '#444',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#555',
    fontSize: 14,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  exerciseContainer: {
    flex: 1,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedExerciseCard: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  checkboxContainer: {
    marginRight: 15,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  completedExerciseName: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF9800',
  },
  finishButton: {
    backgroundColor: '#3498db',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  spacer: {
    height: 80, // Add extra space at the bottom of the ScrollView
  },
});

export default StartWorkout;