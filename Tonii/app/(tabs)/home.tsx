import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
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
  
  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(18);
  
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
      <View className="mb-5">
        <View className="flex-row justify-between mb-2.5">
          {dayNames.map((day, index) => (
            <Text key={`day-label-${index}`} className="flex-1 text-center text-base text-gray-500">{day}</Text>
          ))}
        </View>
        <View className="flex-row justify-between">
          {days.map((day, index) => (
            <TouchableOpacity 
              key={`day-${index}`} 
              onPress={() => setSelectedDay(day)}
              className={`w-9 h-9 rounded-full justify-center items-center mx-0.5 ${day === selectedDay ? 'bg-orange-600' : ''}`}
            >
              <Text className={`text-base font-medium ${day === selectedDay ? 'text-white' : 'text-black'}`}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="p-5 pb-20" 
        showsVerticalScrollIndicator={false} 
      >
        <View className="mb-8 pt-2.5">
          {loading ? (
            <ActivityIndicator size="large" color="#FF6F00" />
          ) : (
            <Text className="text-2xl leading-8">
              Hi, <Text className="text-2xl font-bold text-orange-600">{user.username}!</Text>{"\n"}
              <Text className="text-lg text-gray-600 mt-1">Ready to crush your goals today?</Text>
            </Text>
          )}
        </View>
        
        {/* Workout Plans Section */}
        <View className="mb-8 bg-white rounded-2xl p-5 shadow-md">
          <Text className="text-lg font-bold mb-4 text-gray-800">Pin Workout Plans</Text>
          
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
              ) : (
                <ScrollView 
                  className="max-h-64 rounded-lg"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {workoutPlans.map((plan) => (
                    <TouchableOpacity 
                      key={plan.id} 
                      className="bg-gray-50 p-4.5 rounded-lg mb-2.5 flex-row items-center justify-between border-l-4 border-orange-600"
                      onPress={() => navigateToWorkout(plan.id)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-base font-semibold text-gray-800">{plan.name}</Text>
                      <View className="justify-center items-center">
                        <Text className="text-2xl text-orange-600 font-bold">›</Text>
                      </View>
                    </TouchableOpacity>
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
              <Text className="text-xl font-bold">0</Text>
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

export default home;