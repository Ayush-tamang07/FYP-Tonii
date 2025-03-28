import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { userProgress } from '@/context/userAPI'; // Import your API function

const Streak: React.FC = () => {
  const [selected, setSelected] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean; marked: boolean; dotColor: string } }>({});

  // Fetch user progress when the component mounts
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await userProgress();
        if (response.success) {
          // Convert progress data into markedDates format
          const progressDates: { [key: string]: { selected: boolean; marked: boolean; dotColor: string } } = {};
          response.progress.forEach((entry: { completedAt: string }) => {
            const date = entry.completedAt.split('T')[0]; // Extract YYYY-MM-DD from timestamp
            progressDates[date] = { selected: true, marked: true, dotColor: 'orange' };
          });
          setMarkedDates(progressDates);
        }
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-center text-2xl flex-1 font-semibold">Streak</Text>
      </View>
      <Calendar
        onDayPress={(day: DateData) => setSelected(day.dateString)}
        markedDates={{
          ...markedDates,
          [selected]: { selected: true, disableTouchEvent: true, dotColor: 'blue' },
        }}
      />
    </SafeAreaView>
  );
};

export default Streak;
