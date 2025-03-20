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
import BMIChart from "../../components/BMIChart"; // Import the BMI Chart component

interface WorkoutPlan {
  id: number;
  name: string;
}

interface UserData {
  username: string;
  weight?: string | number;
  height?: string | number;
  dob?: string;
  gender?: string;
}

const home = () => {
  const [user, setUser] = useState<UserData>({ username: "" });
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For the history section
  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(18); // Default to day 18 as shown in the image
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data) {
        setUser({ 
          username: data.username || "User",
          weight: data.weight || "",
          height: data.height || "",
          dob: data.dob || "",
          gender: data.gender || "",
        });
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

  const navigateToWorkout = (id: number) => {
    router.push(`/workout/${id}`);
  };
  
  const navigateToAllRecords = () => {
    router.push("/(streak)/streak");
  };
  
  // Generate week days for history section
  const renderWeekDays = () => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const days = [16, 17, 18, 19, 20, 21, 22]; // Days shown in screenshot
    
    return (
      <View style={styles.weekDaysContainer}>
        <View style={styles.weekDayLabels}>
          {dayNames.map((day, index) => (
            <Text key={`day-label-${index}`} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>
        <View style={styles.weekDays}>
          {days.map((day, index) => (
            <TouchableOpacity 
              key={`day-${index}`} 
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayButton,
                day === selectedDay && styles.selectedDayButton
              ]}
            >
              <Text style={[
                styles.dayNumber,
                day === selectedDay && styles.selectedDayNumber
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
      >
        <View style={styles.header}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF6F00" />
          ) : (
            <Text style={styles.greeting}>
              Hi, <Text style={styles.username}>{user.username}!</Text>{"\n"}
              <Text style={styles.motivationalText}>Ready to crush your goals today?</Text>
            </Text>
          )}
        </View>
        
        {/* Workout Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Workout Plans</Text>
          
          {workoutLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6F00" />
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {!workoutLoading && !error && (
            <View style={styles.workoutListContainer}>
              {workoutPlans.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.noWorkoutsText}>No workout plans available.</Text>
                  <TouchableOpacity 
                    style={styles.createButton}
                    onPress={() => router.push("/(workout)/createRoutine")}
                  >
                    <Text style={styles.createButtonText}>Create Your First Plan</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView 
                  style={styles.workoutScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {workoutPlans.map((plan) => (
                    <TouchableOpacity 
                      key={plan.id} 
                      style={styles.workoutItem}
                      onPress={() => navigateToWorkout(plan.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.workoutText}>{plan.name}</Text>
                      <View style={styles.arrowContainer}>
                        <Text style={styles.arrow}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
        
        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>History</Text>
            <TouchableOpacity onPress={navigateToAllRecords}>
              <Text style={styles.allRecordsText}>All records</Text>
            </TouchableOpacity>
          </View>
          
          {renderWeekDays()}
          
          <View style={styles.streakContainer}>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <View style={styles.streakValueContainer}>
              <Text style={styles.fireIcon}>🔥</Text>
              <Text style={styles.streakValue}>0</Text>
            </View>
          </View>
        </View>
        
        {/* BMI Chart - Moved to the end as requested */}
        {!loading && user.height && user.weight && (
          <BMIChart height={user.height} weight={user.weight} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 30,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 22,
    lineHeight: 32,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6F00",
  },
  motivationalText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  // History styles
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  allRecordsText: {
    color: '#FF6F00',
    fontSize: 16,
    fontWeight: '500',
  },
  weekDaysContainer: {
    marginBottom: 20,
  },
  weekDayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#777',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  selectedDayButton: {
    backgroundColor: '#FF6F00',
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '500',
  },
  selectedDayNumber: {
    color: '#FFFFFF',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  streakLabel: {
    fontSize: 16,
    color: '#555',
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIcon: {
    fontSize: 18,
    marginRight: 5,
    color: '#FF6F00',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Workout Plans styles
  workoutListContainer: {
    borderRadius: 10,
    maxHeight: 250,
  },
  workoutScrollView: {
    maxHeight: 250,
    borderRadius: 10,
  },
  workoutItem: {
    backgroundColor: "#F5F7FA",
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6F00",
  },
  workoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    color: "#FF6F00",
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  }
});

export default home;