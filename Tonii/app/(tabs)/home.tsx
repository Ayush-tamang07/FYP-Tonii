import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity,
  Dimensions
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
  const [streak, setStreak] = useState(7); // Example streak count
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  
  // Example data for calendar
  const [workoutDays, setWorkoutDays] = useState([
    2, 3, 5, 6, 9, 12, 13, 16, 17, 19, 20, 23, 24, 26, 27, 30
  ]);
  
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

  const navigateToWorkout = (id: number) => {
    router.push(`/workout/${id}`);
  };

  // Generate calendar days in a grid format
  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Day names for the header
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Create calendar header with day names
    const header = dayNames.map(day => (
      <View key={`header-${day}`} style={styles.calendarHeaderDay}>
        <Text style={styles.calendarHeaderText}>{day}</Text>
      </View>
    ));
    
    // Create calendar days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarDay}>
          <View style={styles.emptyDay}></View>
        </View>
      );
    }
    
    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isWorkoutDay = workoutDays.includes(i);
      const isToday = i === today.getDate();
      
      days.push(
        <View key={i} style={styles.calendarDay}>
          <View 
            style={[
              styles.dayCircle,
              isToday && styles.todayCircle, 
              isWorkoutDay && styles.workoutDayCircle
            ]}
          >
            <Text style={[
              styles.dayText,
              isToday && styles.todayText, 
              isWorkoutDay && styles.workoutDayText
            ]}>
              {i}
            </Text>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          {header}
        </View>
        <View style={styles.calendarGrid}>
          {days}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Streak</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakCount}>{streak} days</Text>
              <Text style={styles.streakMonth}>{currentMonth}</Text>
            </View>
            {renderCalendar()}
          </View>
        </View>

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
                  <TouchableOpacity style={styles.createButton}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

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
  workoutListContainer: {
    borderRadius: 10,
    height: 250,
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
  },
  // Calendar styles
  streakContainer: {
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
    padding: 15,
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  streakCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6F00",
  },
  streakMonth: {
    fontSize: 16,
    color: "#666",
  },
  calendarContainer: {
    marginBottom: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  calendarHeaderDay: {
    width: width / 7 - 10,
    alignItems: "center",
  },
  calendarHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: width / 7 - 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  emptyDay: {
    width: 30,
    height: 30,
  },
  workoutDayCircle: {
    backgroundColor: "#FF6F00",
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: "#FF6F00",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  workoutDayText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  todayText: {
    fontWeight: "bold",
    color: "#FF6F00",
  },
});

export default home;