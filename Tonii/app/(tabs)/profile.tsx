import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { fetchUserDetails } from '../../context/userAPI';
import { router, useRouter } from 'expo-router';

const profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    image:''
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data) {
        setUser({
          username: data.username || '',
          email: data.email || '',
          image: data.image || '',
        });
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f9fc]">
        <ActivityIndicator size="large" color="#3498db" />
        <Text className="mt-2.5 text-[#777] text-base">Loading profile...</Text>
      </View>
    );
  }
  // import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const handleLogout = async () => {
    try {
      // Clear stored user authentication tokens or data
      const token = await SecureStore.deleteItemAsync("AccessToken");
      
      // Reset the navigation stack or navigate directly to the login screen
      router.replace('/(auth)/login');
  
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  return (
    <ScrollView
      className="flex-1 bg-[#f7f9fc]"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />

      {/* Profile Card */}
      <View className="items-center mx-5 mt-5 p-5 shadow-sm">
        <View className="relative mb-4">
          <Image
            source={{ uri: user.image }}
            className="w-[90px] h-[90px] rounded-full border-2 border-[#f5f5f5]"
          />
          {/* <TouchableOpacity className="absolute bottom-0 right-0 bg-[#3498db] w-7 h-7 rounded-full justify-center items-center border-2 border-white">
            <Feather name="camera" size={16} color="white" />
          </TouchableOpacity> */}
        </View>

        <Text className="text-xl font-semibold mt-1 text-[#333]">{user.username}</Text>
        <Text className="text-sm text-[#777] mt-0.5">{user.email}</Text>
      </View>

      {/* Menu Section */}
      <View className="bg-white mx-5 mt-5 rounded-xl p-4 shadow-sm">
        <Text className="text-sm font-semibold text-[#666] mb-2.5 ml-0.5">Account Settings</Text>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-[#f5f5f5]"
          onPress={() => router.push("/(profile)/userDetails")}
          activeOpacity={0.7}
        >
          <View className="w-8 h-8 rounded-full bg-[#3498db] justify-center items-center mr-3">
            <MaterialIcons name="person" size={18} color="white" />
          </View>
          <Text className="text-base text-[#444] flex-1">User Details</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-3 border-b border-[#f5f5f5]" activeOpacity={0.7}>
          <View className="w-8 h-8 rounded-full bg-[#2ecc71] justify-center items-center mr-3">
            <Feather name="settings" size={18} color="white" />
          </View>
          <Text className="text-base text-[#444] flex-1">Settings</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-3" activeOpacity={0.7}
          onPress={() => router.push("/(feedback)/Feedback")}
        >
          <View className="w-8 h-8 rounded-full bg-[#9b59b6] justify-center items-center mr-3">
            <Feather name="message-square" size={18} color="white" />
          </View>
          <Text className="text-base text-[#444] flex-1">Feedback</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" />
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View className="mx-5 mt-5">
        <TouchableOpacity
          className="bg-[#e74c3c] flex-row items-center justify-center py-3.5 rounded-lg shadow-sm"
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={18} color="white" />
          <Text className="text-white text-base font-semibold ml-2">Log out</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <Text className="text-center text-[#999] text-xs mt-5 mb-6">Version 1.0.0</Text>
    </ScrollView>
  );
};

export default profile;