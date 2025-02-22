import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"; // Import icons

export default function TabLayout() {
  const colorScheme = "light"; // Force light mode

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6909", // Orange active color
        tabBarInactiveTintColor: "#000", // Black inactive color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#fff", // Light background
          borderTopWidth: 1,
          borderTopColor: "#ddd", // Light gray border
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
    
      <Tabs.Screen
        name="calorie"
        options={{
          title: "Calorie",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fire" size={size} color={color} />
          ),
        }}
      />
      {/* Workout Tab */}
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      {/* Form Correction Tab */}
      <Tabs.Screen
        name="formCorrection"
        options={{
          title: "Correction",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-circle-outline" size={size} color={color} />
          ),
        }}
      />
          {/* Profile Tab */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" size={size} color={color} />
              ),
            }}
          />
    </Tabs>
  );
}
