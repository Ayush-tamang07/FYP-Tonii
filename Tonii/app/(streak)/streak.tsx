import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { userProgress } from '@/context/userAPI'; // Import your API function
import { LinearGradient } from 'expo-linear-gradient';

const Streak: React.FC = () => {
  const [selected, setSelected] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean; marked: boolean; dotColor: string } }>({});
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  // Fetch user progress when the component mounts
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await userProgress();
        if (response.success) {
          // Convert progress data into markedDates format
          const progressDates: { [key: string]: { selected: boolean; marked: boolean; dotColor: string } } = {};
          
          // Extract dates for streak calculation
          const dates = response.progress.map((entry: { completedAt: string }) => 
            entry.completedAt.split('T')[0]
          ).sort();
          
          // Calculate streaks
          calculateStreaks(dates);
          
          response.progress.forEach((entry: { completedAt: string }) => {
            const date = entry.completedAt.split('T')[0]; // Extract YYYY-MM-DD from timestamp
            progressDates[date] = { 
              selected: true, 
              marked: true, 
              dotColor: '#FF7F50' 
            };
          });
          
          setMarkedDates(progressDates);
        }
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
      }
    };
    
    fetchProgress();
  }, []);

  // Calculate current and longest streaks
  const calculateStreaks = (dates: string[]) => {
    if (!dates.length) return;
    
    let current = 1;
    let longest = 1;
    let previousDate = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        current++;
        longest = Math.max(longest, current);
      } else if (diffDays > 1) {
        current = 1;
      }
      
      previousDate = currentDate;
    }
    
    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  const theme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#333333',
    selectedDayBackgroundColor: '#FF7F50',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#FF7F50',
    dayTextColor: '#333333',
    textDisabledColor: '#d9e1e8',
    dotColor: '#FF7F50',
    selectedDotColor: '#ffffff',
    arrowColor: '#FF7F50',
    monthTextColor: '#333333',
    indicatorColor: '#FF7F50',
    textDayFontWeight: '400',
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '500'
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        colors={['#FFE4E1', '#FFFFFF']}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 py-5 border-b border-gray-100">
          <TouchableOpacity 
            className="rounded-full"
            onPress={() => router.push('/(tabs)/home')}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-2xl font-bold text-gray-800 -mr-10">Your Streak Journey</Text>
        </View>
        
        <View className="flex-row justify-around px-4 py-5">
          <View className="bg-white rounded-2xl p-5 items-center w-[45%] shadow">
            <Text className="text-3xl font-bold text-orange-500 mb-1">{currentStreak}</Text>
            <Text className="text-sm text-gray-600 font-medium">Current Streak</Text>
          </View>
          <View className="bg-white rounded-2xl p-5 items-center w-[45%] shadow">
            <Text className="text-3xl font-bold text-orange-500 mb-1">{longestStreak}</Text>
            <Text className="text-sm text-gray-600 font-medium">Longest Streak</Text>
          </View>
        </View>
        
        <View className="mx-4 my-2 bg-white rounded-2xl p-4 shadow">
          <Text className="text-lg font-semibold mb-3 text-gray-800">Activity Calendar</Text>
          <Calendar
            theme={theme}
            onDayPress={(day: DateData) => setSelected(day.dateString)}
            markedDates={{
              ...markedDates,
              [selected]: { 
                selected: true, 
                disableTouchEvent: true, 
                dotColor: '#ffffff' 
              },
            }}
            className="rounded-lg"
          />
        </View>
        
        <View className="flex-row justify-center mt-4 mb-5">
          <View className="flex-row items-center mx-2">
            <View className="w-3 h-3 rounded-full bg-orange-500 mr-1.5" />
            <Text className="text-xs text-gray-600">Activity Completed</Text>
          </View>
          <View className="flex-row items-center mx-2">
            <View className="w-3 h-3 rounded-full bg-gray-800 border-2 border-orange-500 mr-1.5" />
            <Text className="text-xs text-gray-600">Selected Date</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Streak;