import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import apiHandler from "@/context/APIHandler";
import * as SecureStore from "expo-secure-store";

const CreateRoutine = () => {
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if(!title){
      Alert.alert("Error", "Please enter a routine title");
    }
   
    try {
      const token = await SecureStore.getItemAsync("AccessToken"); // Replace with your access token
      const result = await apiHandler.post("/user/workout-plans",
        {
          name: title
        },
        {
          headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"
          }
        }
      );
      if(result.status === 201) {
        
      }
      router.push("../(tabs)/workout");
    } catch (error) {
      console.log("error",error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Icon & Save */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("../(tabs)/workout")}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Routine</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Routine Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Routine title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      {/* Exercise Placeholder */}
      <View style={styles.exerciseContainer}>
        <Image
          source={{ uri: "https://img.icons8.com/ios/50/dumbbell.png" }}
          style={styles.icon}
        />
        <Text style={styles.exerciseText}>
          Get started by adding an exercise to your routine.
        </Text>
      </View>

      {/* Add Exercise Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => console.log("Add Exercise")}>
        <Text style={styles.addButtonText}>+ Add exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoutine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  cancelText: {
    color: "#3498db",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  saveText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F5F5F5",
    color: "#000",
    fontSize: 16,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  exerciseContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: "#666",
  },
  exerciseText: {
    color: "#777",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#FF8200",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
