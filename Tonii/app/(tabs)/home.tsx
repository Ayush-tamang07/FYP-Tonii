import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity
} from "react-native";
import { fetchUserDetails, workoutPlan } from "../../context/userAPI";
import { router } from "expo-router";

interface WorkoutPlan {
  id: number;
  name: string;
}

const home = () => {
  const [user, setUser] = useState({ username: "" });
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data) {
        setUser({ username: data.username || "User" });
      }
      setLoading(false);
    };

    const fetchWorkoutPlans = async () => {
      setWorkoutLoading(true);
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
        setWorkoutLoading(false);
      }
    };

    fetchUserData();
    fetchWorkoutPlans();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true} 
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.greeting}>Hi, {user.username}!{"\n"}Ready to crush your goals today?</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Workout Plans</Text>
          {workoutLoading && <ActivityIndicator size="large" color="#FF6F00" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <View style={styles.scrollContainer}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {!workoutLoading && !error && workoutPlans.length === 0 && (
                <Text style={styles.noWorkoutsText}>No workout plans available.</Text>
              )}
              {!workoutLoading && !error && workoutPlans.map((plan) => (
                <View key={plan.id} style={styles.workoutItem}>
                  <Text style={styles.workoutText}>{plan.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      
      <TouchableOpacity
          // style={[styles.button, styles.newRoutineButton]}
          onPress={() => router.push("/(workout)/singleExercise")}
        >
          {/* <Ionicons name="clipboard-outline" size={18} color="white" /> */}
          {/* <Text style={styles.newRoutineButtonText}> New Routine</Text> */}
          <Text style={{backgroundColor:'blue'}}>Exercise details</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:20
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollContainer: {
    maxHeight: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
  },
  workoutItem: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutText: {
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
  noWorkoutsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
});

export default home;
