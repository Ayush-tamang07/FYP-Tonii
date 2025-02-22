import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons"; // Icons for UI elements
import { router } from "expo-router";
import { workoutPlan } from "../../context/userAPI"; // Import API function

const Workout = () => {
  const [expanded, setExpanded] = useState(true);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [error, setError] = useState<string | null>(null);


  // Fetch workout plans for logged-in user
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await workoutPlan(); // Call API function
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
        } else if (response.status === 400) {
          setError(response.message);
        } else {
          setWorkoutPlans(response.data || []); // Ensure data is an array
        }
      } catch (err) {
        setError("Failed to fetch workout plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Workout</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.newRoutineButton]}
          onPress={() => router.replace("../(workout)/createRoutine")}
        >
          <Ionicons name="clipboard-outline" size={18} color="white" />
          <Text style={styles.newRoutineButtonText}> New Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.exploreButton]}>
          <Ionicons name="search-outline" size={18} color="black" />
          <Text style={styles.exploreText}> Explore</Text>
        </TouchableOpacity>
      </View>

      {/* My Routine Section */}
      <TouchableOpacity style={styles.myRoutineHeader} onPress={() => setExpanded(!expanded)}>
        <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={18} color="black" />
        <Text style={styles.myRoutineTitle}>My Routine ({workoutPlans.length})</Text>
      </TouchableOpacity>

      {/* Loading State */}
      {loading && <ActivityIndicator size="large" color="#FF6F00" />}

      {/* Error State */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Routine List */}
      {!loading && !error && expanded && (
        <ScrollView>
          <View style={styles.workoutList}>
            {workoutPlans.map((plan, index) => (
              <View key={index} style={styles.workoutItem}>
                {/* Routine Name & Options */}
                <View style={styles.workoutRow}>
                  <Text style={styles.workoutText}>{plan.name}</Text>
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

export default Workout;
