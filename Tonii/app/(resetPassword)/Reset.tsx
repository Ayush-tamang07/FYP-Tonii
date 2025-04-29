import { View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import apiHandler from '@/context/APIHandler'; // Update path as needed
import axios from 'axios';

const Reset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
  
    setLoading(true);
    try {
      const response = await apiHandler.post('/requestOtp', { email });
  
      if (response.status === 200) {
        router.push({
          pathname: "/(resetPassword)/Verification",
          params: { email },
        });
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong. Please try again.';
  
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = 'This email is not registered.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
  
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <View className="px-4 pt-4">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mt-6">
          <Text className="text-3xl font-bold mb-2">Reset Password</Text>
          <Text className="text-sm text-gray-500 mb-8">
            Enter your email address to reset your password
          </Text>
        </View>

        <View className="mb-8">
          <TextInput
            placeholder="user@example.com"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg p-4 mb-1"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Text className="text-xs text-gray-400 ml-1">
            We'll send a verification code to this email
          </Text>
        </View>

        <TouchableOpacity
          className={`${loading ? 'bg-orange-400' : 'bg-orange-500'} py-4 rounded-lg mb-4`}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Sending...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reset;