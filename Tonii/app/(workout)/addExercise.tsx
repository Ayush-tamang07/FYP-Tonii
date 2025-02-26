import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const exercises = [
  { 
    name: "Bench Press", 
    muscle: "Chest", 
    image: "https://img.freepik.com/free-photo/front-view-fit-shirtless-man-showing-pecs_23-2148700660.jpg?t=st=1740588383~exp=1740591983~hmac=033f533a6d847010e9b71c32e73c576aa7807f76afd0ff65b28851221faeb667&w=1060" 
  },
  { 
    name: "Shoulder Press", 
    muscle: "Shoulders", 
    image: "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2013/12/Shoulders3.jpg?quality=86&strip=all" 
  },
  { 
    name: "Bicep Curl", 
    muscle: "Arms", 
    image: "https://i.pinimg.com/474x/27/07/1a/27071ae7055554d1329dc71afe9fb243.jpg" 
  },
  { 
    name: "Squat", 
    muscle: "Legs", 
    image: "https://cdn.shopify.com/s/files/1/0564/2607/0148/files/Quads_-_Edited.png?v=1678905166" 
  },
  { 
    name: "Plank", 
    muscle: "Core", 
    image: "https://img.freepik.com/free-photo/shirtless-sporty-male-holding-barbell-weights-isolated-grey-background_613910-16661.jpg?ga=GA1.1.1686581895.1740588126&semt=ais_hybrid" 
  },
  { 
    name: "Deadlift", 
    muscle: "Back", 
    image: "https://cdn.muscleandstrength.com/sites/default/files/best_back_exercises_-_1200x630.jpg" 
  },
];

const AddExercise = () => {
  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={() => router.push("/(workout)/createRoutine")}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Exercise</Text>
        <TouchableOpacity>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercise"
        placeholderTextColor="#888"
      />

      {/* Filter Buttons */}
      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Muscles</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseItem}>
            <Image source={{ uri: item.image }} style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMuscle}>{item.muscle}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#888" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    padding: 20,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  createText: {
    color: '#007BFF',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // For Android shadow
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  exerciseName: {
    fontSize: 18,
    color: '#333',
  },
  exerciseMuscle: {
    fontSize: 14,
    color: '#666',
  },
});

export default AddExercise;
