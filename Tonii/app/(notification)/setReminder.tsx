import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import apiHandler from '@/context/APIHandler';
import * as SecureStore from "expo-secure-store";


interface Reminder {
  id: string;
  scheduledAt: Date;
  notificationId?: string;
}

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SetReminder: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [savedReminders, setSavedReminders] = useState<Reminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(granted => {
      setNotificationPermission(granted);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      router.push('/(tabs)/workout');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const saveReminder = async () => {
    const scheduledAt = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0
    );

    const now = new Date();
    if (scheduledAt <= now) {
      Alert.alert('Invalid Time', 'Please select a future date and time.');
      return;
    }

    let notificationId;

    if (!notificationPermission) {
      Alert.alert('Permission Needed', 'Please enable notification permissions.');
      return;
    }

    try {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Workout Reminder 💪',
          body: "It's time to workout!",
          sound: true,
          data: { screen: '/(tabs)/workout' },
        },
        trigger: scheduledAt,
      });

      console.log(`✅ Local notification scheduled: ${notificationId}`);
    } catch (error) {
      console.error('❌ Local notification failed:', error);
    }

    // Send to backend
    try {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (!token) {
        return { status: 401, message: "Unauthorized: No token found" };
      }
      const res = await apiHandler.post(
        `/reminders`,
        {
          scheduledAt: scheduledAt.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = res.data;
      
      console.log("✅ Reminder saved to backend:", data);
    } catch (err) {
      console.error("❌ Failed to save reminder to backend:", err);
      Alert.alert("Server Error", "Reminder not saved to backend.");
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      scheduledAt,
      notificationId,
    };

    setSavedReminders(prev => [...prev, newReminder].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()));
    Alert.alert('Reminder Saved', `Reminder set for ${scheduledAt.toLocaleString()}`);
  };

  const deleteReminder = async (id: string) => {
    const reminder = savedReminders.find(r => r.id === id);
    if (reminder?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
      console.log(`❌ Cancelled notification ID ${reminder.notificationId}`);
    }
    setSavedReminders(savedReminders.filter(r => r.id !== id));
  };

  const formatDate = (date: Date) => date.toLocaleDateString();
  const formatTime = (time: Date) => time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getTimeFromNow = (d: Date) => {
    const diff = d.getTime() - Date.now();
    if (diff < 0) return "Past";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `in ${mins} min`;
    return `in ${Math.floor(mins / 60)} hr`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity className="p-2 rounded-full" onPress={() => router.push('/(tabs)/workout')}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-center text-xl flex-1 font-semibold text-gray-800">Set Reminder</Text>
      </View>

      <View className="p-4">
        <View className="mb-6">
          <Text className="text-lg font-medium text-gray-700 mb-2">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white p-4 rounded-xl border border-gray-200 flex-row justify-between items-center"
          >
            <Text className="text-gray-800 text-base">{formatDate(date)}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
          )}
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-gray-700 mb-2">Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="bg-white p-4 rounded-xl border border-gray-200 flex-row justify-between items-center"
          >
            <Text className="text-gray-800 text-base">{formatTime(time)}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={time} mode="time" display="default" onChange={onTimeChange} />
          )}
        </View>

        <TouchableOpacity
          className="bg-green-600 py-4 px-6 rounded-xl flex-row justify-center items-center mt-4 shadow-sm"
          onPress={saveReminder}
        >
          <Ionicons name="alarm-outline" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg">Set Reminder</Text>
        </TouchableOpacity>
      </View>
      
      {/* {savedReminders.length > 0 && (
        <View className="p-4 mt-2">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Upcoming Reminders</Text>
          <View className="bg-white rounded-xl overflow-hidden shadow-sm">
            {savedReminders.map(reminder => (
              <View key={reminder.id} className="p-4 flex-row justify-between items-center border-b border-gray-100">
                <View className="flex-1">
                  <Text className="text-gray-800">{reminder.scheduledAt.toLocaleString()}</Text>
                  <Text className="text-gray-400 text-sm">{getTimeFromNow(reminder.scheduledAt)}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteReminder(reminder.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )} */}
    </SafeAreaView>
  );
};

// Permission function
async function registerForPushNotificationsAsync(): Promise<boolean> {
  let granted = false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    granted = finalStatus === 'granted';
  } else {
    Alert.alert('Use a physical device', 'Push notifications only work on real devices');
  }

  return granted;
}

export default SetReminder;
