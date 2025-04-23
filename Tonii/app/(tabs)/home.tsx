import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchUserDetails, workoutPlan, userProgress } from "../../context/userAPI";
import { router } from "expo-router";
import BMIChart from "../../components/BMIChart";
import { Ionicons } from "@expo/vector-icons";

interface WorkoutPlan {
  id: number;
  name: string;
  isPinned: boolean;
}

interface UserData {
  username: string;
  weight?: string | number;
  height?: string | number;
  dob?: string;
  gender?: string;
}

const Home = () => {
  const [user, setUser] = useState<UserData>({ username: "" });
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [pinnedPlans, setPinnedPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [weeklyCompletedDates, setWeeklyCompletedDates] = useState<number[]>([]);

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
          const allPlans = response.data || [];
          setWorkoutPlans(allPlans);
          const pinned = allPlans.filter((plan: WorkoutPlan) => plan.isPinned);
          setPinnedPlans(pinned);
        }
      } catch (err) {
        setError("Failed to fetch workout plans.");
      } finally {
        setWorkoutLoading(false);
      }
    };

    const fetchWeekStreak = async () => {
      try {
        const response = await userProgress();
        if (response.success) {
          const currentWeekDates: number[] = [];

          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          const completedDates: Date[] = response.progress.map((entry: { completedAt: string }) =>
            new Date(entry.completedAt)
          );

          completedDates.forEach((dateObj: Date) => {
            if (dateObj >= startOfWeek && dateObj <= endOfWeek) {
              currentWeekDates.push(dateObj.getDate());
            }
          });

          setWeeklyCompletedDates(currentWeekDates);
        }
      } catch (error) {
        console.log("Failed to fetch week streak", error);
      }
    };

    fetchUserData();
    fetchWorkoutPlans();
    fetchWeekStreak();
  }, []);

  const startWorkout = (id: number) => {
    router.push({
      pathname: "/(workout)/startWorkout",
      params: { id: id },
    });
  };

  const navigateToAllRecords = () => {
    router.push("/(streak)/streak");
  };

  const navigateToWorkouts = () => {
    router.push("/(tabs)/workout");
  };

  const renderWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return {
        label: day.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        date: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
      };
    });

    return (
      <View className="mb-5">
        <View className="flex-row justify-between mb-2.5">
          {weekDays.map((day, index) => (
            <Text key={`day-label-${index}`} className="flex-1 text-center text-base text-gray-500">
              {day.label}
            </Text>
          ))}
        </View>
        <View className="flex-row justify-between">
          {weekDays.map((day, index) => {
            const isToday = day.date === todayDate && day.month === todayMonth && day.year === todayYear;
            const isSelected = day.date === selectedDay;
            const isCompleted = weeklyCompletedDates.includes(day.date);

            let bgColor = "";
            let textColor = "text-black";

            if (isToday) {
              bgColor = "bg-orange-600";
              textColor = "text-white";
            } else if (isSelected) {
              bgColor = "bg-gray-300";
              textColor = "text-black";
            } else if (isCompleted) {
              bgColor = "bg-orange-100";
              textColor = "text-orange-600";
            }

            return (
              <TouchableOpacity
                key={`day-${index}`}
                onPress={() => setSelectedDay(day.date)}
                className={`w-9 h-9 rounded-full justify-center items-center mx-0.5 ${bgColor}`}
              >
                <Text className={`text-base font-medium ${textColor}`}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" >
      {/* Sticky Header */}
      <View className="pt-4 pb-3 px-5 bg-gray-50 z-10 ">
        {loading ? (
          <ActivityIndicator size="large" color="#FF6F00" />
        ) : (
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl leading-8">
                Hi, <Text className="font-bold text-orange-600">{user.username}!</Text>
              </Text>
              <Text className="text-lg text-gray-600 mt-1">
                Ready to crush your goals today?
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(notification)/notification")}>
              <Ionicons name="notifications" size={28} color="#FF6F00" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Plans Section */}
        <View className="mb-8 bg-white rounded-2xl p-5 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Pin Workout Plans</Text>
            <TouchableOpacity onPress={navigateToWorkouts}>
              <Text className="text-orange-600 text-base font-medium">See all</Text>
            </TouchableOpacity>
          </View>

          {workoutLoading && (
            <View className="p-5 items-center">
              <ActivityIndicator size="large" color="#FF6F00" />
            </View>
          )}

          {error && (
            <View className="bg-red-50 rounded-lg p-4 my-2.5 border-l-4 border-red-600">
              <Text className="text-red-700 text-base font-medium">{error}</Text>
            </View>
          )}

          {!workoutLoading && !error && (
            <View className="rounded-lg max-h-64">
              {workoutPlans.length === 0 ? (
                <View className="items-center p-8 bg-gray-50 rounded-lg">
                  <Text className="text-base text-gray-500 mb-5">No workout plans available.</Text>
                  <TouchableOpacity
                    className="bg-orange-600 py-3 px-6 rounded-full"
                    onPress={() => router.push("/(workout)/createRoutine")}
                  >
                    <Text className="text-white font-semibold text-base">Create Your First Plan</Text>
                  </TouchableOpacity>
                </View>
              ) : pinnedPlans.length === 0 ? (
                <View className="items-center p-8 bg-gray-50 rounded-lg">
                  <Text className="text-base text-gray-500 mb-5">No pinned workout plans yet.</Text>
                  <TouchableOpacity
                    className="bg-orange-600 py-3 px-6 rounded-full"
                    onPress={navigateToWorkouts}
                  >
                    <Text className="text-white font-semibold text-base">Pin a Workout</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView
                  className="max-h-64 rounded-lg"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {pinnedPlans.map((plan: WorkoutPlan) => (
                    <View key={plan.id} className="mb-2.5 last:mb-0">
                      <View className="bg-gray-50 rounded-lg overflow-hidden">
                        <View className="flex-row items-center">
                          <View className="w-1.5 bg-orange-600 h-full" />
                          <View className="flex-1 flex-row items-center justify-between py-4 px-3">
                            <Text className="text-base font-semibold text-gray-800 ml-2">{plan.name}</Text>
                            <TouchableOpacity
                              className="bg-orange-600 py-2 px-4 rounded-lg"
                              onPress={() => startWorkout(plan.id)}
                            >
                              <Text className="text-white font-medium text-sm">Start</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* History Section */}
        <View className="mb-8 bg-white rounded-2xl p-5 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">History</Text>
            <TouchableOpacity onPress={navigateToAllRecords}>
              <Text className="text-orange-600 text-base font-medium">All records</Text>
            </TouchableOpacity>
          </View>

          {renderWeekDays()}

          <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
            <Text className="text-base text-gray-600">Day Streak</Text>
            <View className="flex-row items-center">
              <Text className="text-lg mr-1 text-orange-600">🔥</Text>
              <Text className="text-xl font-bold">{weeklyCompletedDates.length}</Text>
            </View>
          </View>
        </View>

        {!loading && user.height && user.weight && (
          <BMIChart height={user.height} weight={user.weight} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
