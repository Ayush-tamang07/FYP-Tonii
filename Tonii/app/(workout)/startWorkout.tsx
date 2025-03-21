import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  Dimensions, 
  SafeAreaView,
  Image,
  Animated 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import apiHandler from "../../context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  image?: string;
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
  
  // Countdown state
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const countdownAnim = useRef(new Animated.Value(1)).current;
  
  // Checkbox states
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: boolean }>({});

  // Category image URLs
  const chest = "https://i.pinimg.com/474x/c9/b4/54/c9b4541a7a7caba5ef28d8e2bc7d8442.jpg"
  const back = "https://i.pinimg.com/474x/de/e7/41/dee741a33bf48089d71ffe5b4355e3ef.jpg"
  const shoulders = "https://i.pinimg.com/474x/9e/c1/04/9ec1042e907e606428e9b08785882fde.jpg"
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg"
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg"
  const core = "https://i.pinimg.com/474x/a5/5f/d1/a55fd1efb160ad91b420113794d478c6.jpg"

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

  // Get appropriate image based on category
  const getCategoryImage = (category: string, fallbackImage?: string): string => {
    if (!category) return chest; // Default fallback
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('chest')) return chest;
    if (lowerCategory.includes('back')) return back;
    if (lowerCategory.includes('shoulder')) return shoulders;
    if (lowerCategory.includes('leg') || lowerCategory.includes('quad') || lowerCategory.includes('hamstring') || lowerCategory.includes('calf')) return leg;
    if (lowerCategory.includes('arm') || lowerCategory.includes('bicep') || lowerCategory.includes('tricep')) return arms;
    if (lowerCategory.includes('core') || lowerCategory.includes('ab') || lowerCategory.includes('abdominal')) return core;
    return fallbackImage || chest;
  };

  // Function to start the countdown
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(3);
    
    // Animate countdown number
    Animated.timing(countdownAnim, {
      toValue: 2,
      duration: 1000,
      useNativeDriver: true
    }).start();
    
    const intervalId = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsCountingDown(false);
          startWorkout();
          return 0;
        }
        
        // Reset and restart animation for each count
        countdownAnim.setValue(1);
        Animated.timing(countdownAnim, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true
        }).start();
        
        return prev - 1;
      });
    }, 1000);
  };

  // Function to start the workout
  const startWorkout = () => {
    setIsWorkoutActive(true);
    
    const newTimer = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
    
    setTimer(newTimer);
  };

  // Function to pause the workout
  const pauseWorkout = () => {
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
            {(isWorkoutActive || elapsedTime > 0) && (
              <View style={styles.timerContainer}>
                <FontAwesome5 name="stopwatch" size={24} color="#FF6F00" />
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              </View>
            )}

            {/* Countdown Overlay */}
            {isCountingDown && (
              <View style={styles.countdownOverlay}>
                <Animated.Text 
                  style={[
                    styles.countdownText,
                    { 
                      transform: [
                        { scale: countdownAnim },
                        { translateY: countdownAnim.interpolate({
                          inputRange: [1, 2],
                          outputRange: [0, -20]
                        })}
                      ],
                      opacity: countdownAnim.interpolate({
                        inputRange: [1, 1.5, 2],
                        outputRange: [0, 1, 0]
                      })
                    }
                  ]}
                >
                  {countdown}
                </Animated.Text>
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
                    styles.exerciseItem,
                    completedExercises[exercise.id] && styles.selectedExercise
                  ]}
                  onPress={() => toggleExerciseCompletion(exercise.id)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={{ uri: getCategoryImage(exercise.category, exercise.image) }} 
                    style={styles.exerciseImage} 
                  />
                  <View style={styles.exerciseInfo}>
                    <Text 
                      style={[
                        styles.exerciseName,
                        completedExercises[exercise.id] && styles.completedExerciseName
                      ]}
                    >
                      {exercise.name}
                    </Text>
                    {exercise.category && (
                      <Text style={styles.exerciseMuscle}>{exercise.category}</Text>
                    )}
                    {exercise.description && (
                      <Text style={styles.exerciseDescription} numberOfLines={2}>
                        {exercise.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={() =>
                        router.push({
                          pathname: "/(workout)/singleExercise",
                          params: { id: exercise.id.toString() },
                        })
                      }
                    >
                      <Text style={styles.moreButtonText}>More</Text>
                    </TouchableOpacity>
                    
                    <View style={[
                      styles.checkbox, 
                      completedExercises[exercise.id] && styles.checkboxChecked
                    ]}>
                      {completedExercises[exercise.id] && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
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
                onPress={isWorkoutActive ? pauseWorkout : (elapsedTime > 0 ? startWorkout : startCountdown)}
              >
                <FontAwesome5 
                  name={isWorkoutActive ? "pause-circle" : "play-circle"} 
                  size={20} 
                  color="#fff" 
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {isWorkoutActive ? "Pause Workout" : elapsedTime > 0 ? "Resume Workout" : "Start Workout"}
                </Text>
              </TouchableOpacity>

              {/* Finish Workout Button */}
              {allExercisesCompleted && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.finishButton]} 
                  onPress={() => {
                    pauseWorkout();
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
    backgroundColor: '#f8f9fa',
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
    marginRight: 40,
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
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseContainer: {
    flex: 1,
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
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  exerciseImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },
  exerciseInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  exerciseName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#000",
    marginBottom: 3
  },
  completedExerciseName: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  exerciseMuscle: { 
    fontSize: 14, 
    color: "#666",
    marginBottom: 2
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#888',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 10,
  },
  moreButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: '500',
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
    height: 80,
  },
}); 

export default StartWorkout;