import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { workoutPlan } from "../../context/userAPI";

interface WorkoutPlan {
  id: number;
  name: string;
}

const Workout = () => {
  const [expanded, setExpanded] = useState(true);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await workoutPlan();
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
        } else if (response.status === 400) {
          setError(response.message);
        } else {
          setWorkoutPlans(response.data || []);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Workout</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.newRoutineButton]}
          onPress={() => router.push("../(workout)/createRoutine")}
        >
          <Ionicons name="clipboard-outline" size={18} color="white" />
          <Text style={styles.newRoutineButtonText}> New Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.exploreButton]}
          onPress={() => router.replace("../(workout)/explore")}
        >
          <Ionicons name="search-outline" size={18} color="black" />
          <Text style={styles.exploreText}> Explore</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.myRoutineHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Ionicons
          name={expanded ? "chevron-down" : "chevron-forward"}
          size={18}
          color="black"
        />
        <Text style={styles.myRoutineTitle}>
          My Routine ({workoutPlans.length})
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FF6F00" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && expanded && (
        <ScrollView>
          <View style={styles.workoutList}>
            {workoutPlans.map((plan) => (
              <View key={plan.id} style={styles.workoutItem}>
                <View style={styles.workoutRow}>
                  <Text style={styles.workoutText}>{plan.name}</Text>
                  <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={16} color="black" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(workout)/startWorkout",
                      params: { id: plan.id },
                    })
                  }
                >
                  <Text style={styles.startButtonText}>Start Routine</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 10,
  },
  newRoutineButton: {
    backgroundColor: "#FF6F00",
  },
  exploreButton: {
    backgroundColor: "#E0E0E0",
  },
  newRoutineButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  myRoutineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  myRoutineTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  workoutList: {
    gap: 10,
  },
  workoutItem: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
  },
  workoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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

