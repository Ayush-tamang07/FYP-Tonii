import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import '../../global.css'

export default function TabLayout() {
  // Use a consistent color palette
  const colors = {
    primary: "#FF6909",
    inactive: "#8E8E93",
    background: "#FFFFFF",
    border: "#F2F2F7",
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
        tabBarIconStyle: {
          marginBottom: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
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

      {/* New Tab */}
      <Tabs.Screen
        name="new"
        options={{
          title: "New",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Calorie Tab */}
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
          title: "Form",
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