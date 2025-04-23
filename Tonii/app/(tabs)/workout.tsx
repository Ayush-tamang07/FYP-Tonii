import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { workoutPlan, pinWorkoutPlan } from "../../context/userAPI";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { deleteWorkoutPlan } from '@/context/userAPI';


interface WorkoutPlan {
  id: number;
  name: string;
  isPinned?: boolean;
}

const Workout: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [pinningInProgress, setPinningInProgress] = useState(false);
  const BottomSheetRef = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ["25%"], []);

  const openSheet = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    BottomSheetRef.current?.expand();
  };

  const backDrop = useCallback((props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />, []);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

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

  const handleTogglePin = async () => {
    if (!selectedPlan || pinningInProgress) return;

    setPinningInProgress(true);

    try {
      const newPinState = !(selectedPlan.isPinned || false);
      const response = await pinWorkoutPlan({
        workoutPlanId: selectedPlan.id,
        pin: newPinState
      });

      if (response.status === 200) {
        setWorkoutPlans(prevPlans =>
          prevPlans.map(plan =>
            plan.id === selectedPlan.id
              ? { ...plan, isPinned: newPinState }
              : plan
          )
        );

        BottomSheetRef.current?.close();

        Alert.alert(
          newPinState ? "Routine Pinned" : "Routine Unpinned",
          `${selectedPlan.name} has been ${newPinState ? "pinned" : "unpinned"}.`
        );
      } else {
        Alert.alert("Error", "Failed to update routine pin status.");
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred while updating routine.");
    } finally {
      setPinningInProgress(false);
    }
  };

  const sortedWorkoutPlans = useMemo(() => {
    return [...workoutPlans].sort((a, b) => {
      if ((a.isPinned || false) && !(b.isPinned || false)) return -1;
      if (!(a.isPinned || false) && (b.isPinned || false)) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [workoutPlans]);

  const handleDeleteWorkoutPlan = async (workoutPlanId: number) => {
    try {
      const response = await deleteWorkoutPlan(workoutPlanId);

      if (!response) {
        Alert.alert("Error", "Failed to delete workout plan.");
        return;

      }

      if (response.status == 200) {

        Alert.alert("Success", "Workout plan deleted successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to delete workout plan.");
      }
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      Alert.alert("Error", "An unexpected error occurred while deleting the workout plan.");
    }
  };
  
  return (
    // 
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* <View className="px-4 pt-5 pb-4"> */}
      <View className="">
        <Text className="text-2xl font-bold text-[#333] text-center">Workout</Text>
      </View> 

      <View className="flex-1 px-4 pt-4">
        <View className="flex-row justify-between mb-6 gap-3">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3.5 bg-[#FF6F00] rounded-lg shadow"
            onPress={() => router.push("../(workout)/createRoutine")}
          >
            <Ionicons name="clipboard-outline" size={18} color="white" />
            <Text className="text-base font-semibold text-white ml-1.5">New Routine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3.5 bg-[#f0f0f0] rounded-lg shadow"
            onPress={() => router.replace("../(workout)/explore")}
          >
            <Ionicons name="flash-outline" size={18} color="#333" />
            <Text className="text-base font-semibold text-[#333] ml-1.5">Generate Workout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="flex-row items-center mb-3.5"
          onPress={() => setExpanded(!expanded)}
        >
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={18}
            color="#333"
            className="mr-1"
          />
          <Text className="text-base font-semibold text-[#333]">
            My Routines ({workoutPlans.length})
          </Text>
        </TouchableOpacity>
{/* 
        {loading ? (
          <View className="flex-1 justify-center items-center pb-10">
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text className="mt-3 text-sm text-[#666]">Loading your routines...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center pb-10">
            <Text className="text-[#e74c3c] text-center my-2 text-base">{error}</Text>
            <TouchableOpacity
              className="mt-3 py-2 px-4 bg-[#f0f0f0] rounded-md"
              onPress={() => fetchWorkoutPlans()}
            >
              <Text className="text-[#333] text-sm font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : ( */}
          {/* expanded && ( */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="gap-3 pb-4">
                {sortedWorkoutPlans.length === 0 ? (
                  <View className="p-8 items-center justify-center bg-white rounded-lg border border-[#f0f0f0] border-dashed">
                    <Text className="text-base font-semibold text-[#555] mb-1.5">No routines yet</Text>
                    <Text className="text-sm text-[#888] text-center">Create your first workout routine</Text>
                  </View>
                ) : (
                  sortedWorkoutPlans.map((plan) => (
                    <View key={plan.id} className="bg-white p-4 rounded-lg shadow border border-[#f0f0f0]">
                      <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                          {plan.isPinned && (
                            <Ionicons name="pin" size={16} color="#10b981" style={{ marginRight: 6 }} />
                          )}
                          <Text className="text-base font-semibold text-[#333]">{plan.name}</Text>
                          {/* <Tex>{plan.id}</Tex t> */}
                        </View>
                        <TouchableOpacity className="p-1" onPress={() => openSheet(plan)}>
                          <Entypo name="dots-three-vertical" size={16} color="#555" />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        className="bg-[#FF6F00] py-2.5 rounded-lg items-center"
                        onPress={() =>
                          router.push({
                            pathname: "/(workout)/startWorkout",
                            params: { id: plan.id },
                          })
                        }                >
                        <Text className="text-white text-sm font-semibold">Start Routine</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          {/* ) */}
        {/* )} */}
      </View>
      <BottomSheet
        ref={BottomSheetRef}
        snapPoints={snapPoint}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={backDrop}
        handleIndicatorStyle={{ backgroundColor: '#CCCCCC', width: 40 }}
      >
        <BottomSheetView className="bg-white p-0">
          <View className="items-center py-1 mb-1">
            <Text className="text-gray-600 font-medium" numberOfLines={1}>
              {selectedPlan?.name || "Routine"}
            </Text>
          </View>

          <View className="divide-y divide-gray-100">
            <TouchableOpacity
              className="flex-row items-center px-6 py-4"
              onPress={handleTogglePin}
              disabled={pinningInProgress}
            >
              <View className="w-8">
                <Ionicons
                  name={selectedPlan?.isPinned ? "pin-outline" : "pin"}
                  size={22}
                  color="#10b981"
                />
              </View>
              <Text className="text-base ml-2">
                {pinningInProgress
                  ? "Processing..."
                  : selectedPlan?.isPinned
                    ? "Unpin Routine"
                    : "Pin Routine"
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-6 py-4"
              onPress={() =>
                router.push({
                  pathname: "../(workout)/EditWorkoutPlan",
                  params: { id: selectedPlan?.id.toString() },
                })
              }
            >
              <View className="w-8">
                <Ionicons name="create-outline" size={22} color="#3b82f6" />
              </View>
              <Text className="text-base ml-2">Edit Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-6 py-4"
              onPress={() =>
                router.push("/(notification)/setReminder")
              }
            >
              <View className="w-8">
                <Ionicons name="alarm-outline" size={22} color="#3b82f6" />
              </View>
              <Text className="text-base ml-2">Set Reminder</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity className="flex-row items-center px-6 py-4" onPress={()=> handleDeleteWorkoutPlan(workoutPlans.id)}> */}
            <TouchableOpacity className="flex-row items-center px-6 py-4" onPress={() => selectedPlan && handleDeleteWorkoutPlan(selectedPlan.id)}>
              <View className="w-8">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </View>
              <Text className="text-red-500 text-base ml-2">Delete Routine</Text>
            </TouchableOpacity>
          </View>

          <View className="h-8" />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Workout;