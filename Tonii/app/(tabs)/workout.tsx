import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { workoutPlan } from "../../context/userAPI";

interface WorkoutPlan {
  id: number;
  name: string;
}

const Workout: React.FC = () => {
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Workout</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.newRoutineButton}
            onPress={() => router.push("../(workout)/createRoutine")}
          >
            <Ionicons name="clipboard-outline" size={18} color="white" />
            <Text style={styles.newRoutineButtonText}>New Routine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.replace("../(workout)/explore")}
          >
            <Ionicons name="search-outline" size={18} color="#333" />
            <Text style={styles.exploreText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.myRoutineHeader}
          onPress={() => setExpanded(!expanded)}
        >
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={18}
            color="#333"
            style={styles.expandIcon}
          />
          <Text style={styles.myRoutineTitle}>
            My Routines ({workoutPlans.length})
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text style={styles.loadingText}>Loading your routines...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setLoading(true)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          expanded && (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.workoutList}>
                {workoutPlans.length === 0 ? (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>No routines yet</Text>
                    <Text style={styles.emptyStateSubText}>Create your first workout routine</Text>
                  </View>
                ) : (
                  workoutPlans.map((plan) => (
                    <View key={plan.id} style={styles.workoutItem}>
                      <View style={styles.workoutRow}>
                        <Text style={styles.workoutText}>{plan.name}</Text>
                        <TouchableOpacity style={styles.menuButton}>
                          <Entypo name="dots-three-vertical" size={16} color="#555" />
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
                  ))
                )}
              </View>
            </ScrollView>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 16,
    // backgroundColor: "#fff",
    // borderBottomWidth: 1,
    // borderBottomColor: "#f0f0f0",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  newRoutineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#FF6F00",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exploreButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  newRoutineButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    marginLeft: 6,
  },
  exploreText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  myRoutineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  expandIcon: {
    marginRight: 4,
  },
  myRoutineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginVertical: 8,
    fontSize: 15,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  workoutList: {
    gap: 12,
    paddingBottom: 16,
  },
  workoutItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  workoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  menuButton: {
    padding: 4,
  },
  startButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyStateContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: 'center',
  }
});

export default Workout;