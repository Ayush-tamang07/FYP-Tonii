import React from "react";
import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import back button icon
import { useRouter } from "expo-router";
import "../../global.css";
// import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
  const router = useRouter();

  return (
    <GestureHandlerRootView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="white" translucent={false} />

      <Stack>
        <Stack.Screen name="createRoutine" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="addExercise" options={{ headerShown: false }} />
        <Stack.Screen name="startWorkout" options={{ headerShown: false }} />
        <Stack.Screen name="singleExercise" options={{ headerShown: false }} />
        <Stack.Screen name="EditWorkoutPlan" options={{ headerShown: false }} />
        <Stack.Screen name="AddExerciseToRoutine" options={{ headerShown: false }} />
      </Stack>
      {/* <Toast /> */}
    </GestureHandlerRootView>

  );
};

export default Layout;
