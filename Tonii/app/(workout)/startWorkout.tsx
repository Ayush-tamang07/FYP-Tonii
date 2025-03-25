import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
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
  const chest= "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9OrxMWzC6ARoatL1rrufQg.jpeg"
  // const back1 = "https://i.pinimg.com/474x/de/e7/41/dee741a33bf48089d71ffe5b4355e3ef.jpg"
  const back = "https://www.shutterstock.com/image-photo/rear-view-athletic-man-showing-600w-316147079.jpg"
  // const shoulders = "https://i.pinimg.com/474x/9e/c1/04/9ec1042e907e606428e9b08785882fde.jpg"
  const shoulders ="https://www.madscientistofmuscle.com/1-exercises/1-muscle-anatomy/graphics/deltoids.jpg"
  const leg = "https://i.pinimg.com/474x/fa/13/dd/fa13dddb484b4a9d6585c46647ab70d6.jpg"
  const arms = "https://i.pinimg.com/736x/1c/07/e7/1c07e752bc6f56bc7e3df79c1980efea.jpg"
  // const core = "https://i.pinimg.com/474x/a5/5f/d1/a55fd1efb160ad91b420113794d478c6.jpg"
  const core = "https://st2.depositphotos.com/1726139/5347/i/950/depositphotos_53477943-stock-photo-strong-bodybuilder-with-perfect-abs.jpg"


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
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <View className="flex-1 px-5">
        <View className="flex-row items-center py-4 mb-2.5 border-b border-[#e0e0e0]">
          <TouchableOpacity 
            className="" 
            onPress={() => router.push("/(tabs)/workout")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#333] text-center flex-grow mr-10">
            Workout Routine
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text className="mt-2.5 text-[#555] text-base">Loading exercises...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-5">
            <MaterialIcons name="error-outline" size={40} color="#dc3545" />
            <Text className="text-[#dc3545] text-center mt-2.5 text-base mb-5">{error}</Text>
            <TouchableOpacity 
              className="bg-[#6c757d] px-5 py-2.5 rounded-lg" 
              onPress={() => router.push("/(tabs)/workout")}
            >
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Progress bar */}
            <View className="my-2.5">
              <View className="h-2.5 bg-[#e0e0e0] rounded-md overflow-hidden">
                <View 
                  className="h-full bg-[#4CAF50] rounded-md" 
                  style={{ width: `${calculateProgress()}%` }} 
                />
              </View>
              <Text className="text-center mt-1.5 text-[#555] text-sm">
                {Math.round(calculateProgress())}% Complete
              </Text>
            </View>

            {/* Timer Display */}
            {(isWorkoutActive || elapsedTime > 0) && (
              <View className="flex-row items-center justify-center bg-white py-3 px-5 rounded-xl my-2.5 shadow">
                <FontAwesome5 name="stopwatch" size={24} color="#FF6F00" />
                <Text className="text-2xl font-bold text-[#333] ml-2.5">{formatTime(elapsedTime)}</Text>
              </View>
            )}

            {/* Countdown Overlay */}
            {isCountingDown && (
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)] justify-center items-center z-10">
                <Animated.Text 
                  style={{ 
                    fontSize: 100,
                    fontWeight: 'bold',
                    color: '#fff',
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
                  }}
                >
                  {countdown}
                </Animated.Text>
              </View>
            )}

            <Text className="text-lg font-semibold my-4 text-[#444]">
              Exercises ({exercises.filter(ex => completedExercises[ex.id]).length}/{exercises.length})
            </Text>

            <ScrollView 
              className="flex-1"
              showsVerticalScrollIndicator={false}
            >
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  className={`flex-row items-center bg-white p-4 rounded-xl my-1.5 shadow-sm ${
                    completedExercises[exercise.id] ? "bg-[#FFF5EE] border-l-4 border-[#4CAF50]" : ""
                  }`}
                  onPress={() => toggleExerciseCompletion(exercise.id)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={{ uri: getCategoryImage(exercise.category, exercise.image) }} 
                    className="w-[60px] h-[60px] rounded-full" 
                  />
                  <View className="flex-1 ml-4"> 
                    <Text 
                      className={`text-base font-bold ${
                        completedExercises[exercise.id] 
                          ? "line-through text-[#4CAF50]" 
                          : "text-black"
                      } mb-0.5`}
                    >
                      {exercise.name}
                    </Text>
                    {exercise.category && (
                      <Text className="text-sm text-[#666] mb-0.5">{exercise.category}</Text>
                    )}
                    {exercise.description && (
                      <Text className="text-xs text-[#888]" numberOfLines={2}>
                        {exercise.description}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row items-center ml-2.5 gap-2.5">
                    <TouchableOpacity
                      className="bg-[#F0F0F0] px-4 py-1.5 rounded-full items-center justify-center"
                      onPress={() =>
                        router.push({
                          pathname: "/(workout)/singleExercise",
                          params: { id: exercise.id.toString() },
                        })
                      }
                    >
                      <Text className="text-[#555] text-sm font-medium">More</Text>
                    </TouchableOpacity>
                    
                    <View className={`h-6 w-6 rounded-full border-2 ${
                      completedExercises[exercise.id] 
                        ? "bg-[#4CAF50] border-[#4CAF50]" 
                        : "border-[#aaa]"
                    } justify-center items-center`}>
                      {completedExercises[exercise.id] && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View className="h-20" />
            </ScrollView>

            <View className="py-5">
              {/* Start/Stop Workout Button */}
              <TouchableOpacity 
                className={`flex-row justify-center items-center p-4 rounded-xl mb-2.5 shadow ${
                  isWorkoutActive ? "bg-[#FF9800]" : "bg-[#4CAF50]"
                }`}
                onPress={isWorkoutActive ? pauseWorkout : (elapsedTime > 0 ? startWorkout : startCountdown)}
              >
                <FontAwesome5 
                  name={isWorkoutActive ? "pause-circle" : "play-circle"} 
                  size={20} 
                  color="#fff" 
                  className="mr-2" 
                />
                <Text className="text-base font-bold text-white">
                  {isWorkoutActive ? "Pause Workout" : elapsedTime > 0 ? "Resume Workout" : "Start Workout"}
                </Text>
              </TouchableOpacity>

              {/* Finish Workout Button */}
              {allExercisesCompleted && (
                <TouchableOpacity 
                  className="flex-row justify-center items-center p-4 rounded-xl mb-2.5 shadow bg-[#3498db]" 
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
                    className="mr-2" 
                  />
                  <Text className="text-base font-bold text-white">Complete Workout</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StartWorkout;