import { View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import apiHandler from '@/context/APIHandler'; // Update path as needed


const NewPassword: React.FC = () => {
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
    lowercase: false
  });

  const validatePassword = (pass: string) => {
    setPasswordValidation({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass)
    });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(value => value === true);
  };

  const handleConfirm = async () => {
    // Validate passwords
    if (!isPasswordValid()) {
      Alert.alert('Error', 'Please ensure your password meets all requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiHandler.post('/resetPassword', {
        email,
        password,
        confirmPassword
      });
      
      if (response.status === 200) {
        Alert.alert(
          'Success', 
          'Your password has been reset successfully.', 
          [
            { 
              text: 'Login Now', 
              onPress: () => router.push("/(auth)/login") 
            }
          ]
        );
      }
    } catch (error) {
      const errorMessage = 'Failed to reset password. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push({
      pathname: "/(resetPassword)/Verification",
      params: { email }
    });
  };

  return (
    <View className="flex-1 bg-white" style={{ minHeight: screenHeight }}>
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" />
        
        {/* Header with back button */}
        <View className="px-4 pt-2 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 px-5 justify-between">
          {/* Form section */}
          <View className="pt-4">
            <Text className="text-2xl font-semibold mb-1">Create New Password</Text>
            <Text className="text-sm text-gray-500 mb-6">
              Your new password must be different from previous password
            </Text>

            <Text className="text-sm font-medium mb-2 text-gray-700">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg mb-2">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                className="flex-1 p-3.5"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="px-3"
                disabled={loading}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Password validation indicators */}
            <View className="mb-4 px-1">
              <Text className="text-xs mb-2 text-gray-500">Password must have:</Text>
              <View className="flex-row mb-1 items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-xs ${passwordValidation.length ? 'text-green-500' : 'text-gray-500'}`}>
                  At least 8 characters
                </Text>
              </View>
              <View className="flex-row mb-1 items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-xs ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                  At least one uppercase letter
                </Text>
              </View>
              <View className="flex-row mb-1 items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-xs ${passwordValidation.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                  At least one lowercase letter
                </Text>
              </View>
              <View className="flex-row mb-1 items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${passwordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-xs ${passwordValidation.number ? 'text-green-500' : 'text-gray-500'}`}>
                  At least one number
                </Text>
              </View>
              <View className="flex-row mb-1 items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${passwordValidation.special ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-xs ${passwordValidation.special ? 'text-green-500' : 'text-gray-500'}`}>
                  At least one special character
                </Text>
              </View>
            </View>

            <Text className="text-sm font-medium mb-2 text-gray-700">Confirm Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg">
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="flex-1 p-3.5"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-3"
                disabled={loading}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            
            {password && confirmPassword && password !== confirmPassword && (
              <Text className="text-xs text-red-500 mt-1 px-1">
                Passwords do not match
              </Text>
            )}
          </View>

          {/* Button section - fixed at bottom */}
          <View className="pb-6 w-full">
            <TouchableOpacity
              className={`${loading || !isPasswordValid() || password !== confirmPassword || !password || !confirmPassword
                ? 'bg-orange-300' 
                : 'bg-orange-500'} 
                py-3.5 rounded-lg mb-4 w-full`}
              onPress={handleConfirm}
              disabled={loading || !isPasswordValid() || password !== confirmPassword || !password || !confirmPassword}
            >
              <Text className="text-white text-center font-semibold">
                {loading ? 'Updating...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewPassword;