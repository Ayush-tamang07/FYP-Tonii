import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import apiHandler from '@/context/APIHandler';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Define the type for a notification item
interface NotificationItem {
  id: number;
  message: string;
  createdAt: string;
}

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      console.log("Token:", token); // Debug

      const response = await apiHandler.get("/getReminders", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Response:", response.data); // Debug

      if (response.data && response.data.reminders) {
        setNotifications(response.data.reminders);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FCAC29" />
        <Text className="text-gray-500 mt-4 font-medium">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white flex-row items-center p-4 shadow-sm">
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/home')}
          className="p-2 rounded-full active:bg-gray-100"
        >
          <MaterialIcons name='arrow-back' size={24} color='#333' />
        </TouchableOpacity>
        <Text className="text-center text-2xl flex-1 font-semibold text-gray-800">Feedback</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-6">
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="notifications-off" size={64} color="#CCCCCC" />
            <Text className="text-gray-500 mt-4 text-lg font-medium">No notifications yet</Text>
            <Text className="text-gray-400 text-center mt-2 px-10">
              When you receive notifications, they will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="mb-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-3">
                  <View className="h-8 w-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <MaterialIcons name="notifications" size={16} color="#FCAC29" />
                  </View>
                  <Text className="text-xs text-gray-500 font-medium">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="text-gray-800 font-medium leading-5">{item.message}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default NotificationScreen;