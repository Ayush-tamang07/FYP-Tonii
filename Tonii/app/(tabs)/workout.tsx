import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons'; // Icons for UI elements

const Workout = () => {
  const [expanded, setExpanded] = useState(true); // State to handle expand/collapse

  const routines = [
    { name: "Push" },
    { name: "Pull" },
    { name: "Leg" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Workout</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.newRoutineButton]}>
          <Ionicons name="clipboard-outline" size={18} color="white" />
          <Text style={styles.newRoutineButtonText}> New Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.exploreButton]}>
          <Ionicons name="search-outline" size={18} color="black" />
          <Text style={styles.exploreText}> Explore</Text>
        </TouchableOpacity>
      </View>


      {/* My Routine Section */}
      <TouchableOpacity
        style={styles.myRoutineHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={18} color="black" />
        <Text style={styles.myRoutineTitle}>My Routine ({routines.length})</Text>
      </TouchableOpacity>

      {/* Routine List */}
      {expanded && (
        <ScrollView>
          <View style={styles.workoutList}>
            {routines.map((routine, index) => (
              <View key={index} style={styles.workoutItem}>
                {/* Routine Name & Options */}
                <View style={styles.workoutRow}>
                  <Text style={styles.workoutText}>{routine.name}</Text>
                  <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={16} color="black" />
                  </TouchableOpacity>
                </View>

                {/* Start Routine Button */}
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Routine</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',  // Make it take full width
    justifyContent: 'space-between',
    gap: 10, // Add spacing between buttons
  },
  button: {
    flex: 1,  // Each button takes equal width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 10,
  },
  newRoutineButton: {
    backgroundColor: '#FF6F00', // Orange color
  },
  exploreButton: {
    backgroundColor: '#E0E0E0', // Light gray
  },
  newRoutineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  exploreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },  
  myRoutineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  myRoutineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutList: {
    gap: 10,
  },
  workoutItem: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
  },
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Workout;
