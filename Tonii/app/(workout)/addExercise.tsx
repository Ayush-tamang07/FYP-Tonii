import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const AddExercise = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
      <TouchableOpacity onPress={() => router.push("/(workout)/createRoutine")}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Exercise</Text>
        <TouchableOpacity>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercise"
        placeholderTextColor="#888"
      />
      
      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Muscles</Text>
        </TouchableOpacity>
      </View>
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
  cancelText: {
    color: '#007BFF',
    fontSize: 18,
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
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  }
});

export default AddExercise;