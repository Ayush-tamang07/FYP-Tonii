import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { fetchUserDetails, updateUserDetails } from '../../context/userAPI';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateUser = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    weight: '',
    dob: '',
    height: '',
    gender: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<any>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data) {
        const userDOB = data.dob ? new Date(data.dob) : new Date();
        setUser({
          username: data.username || '',
          email: data.email || '',
          weight: data.weight?.toString() || '',
          dob: userDOB.toISOString().split('T')[0],
          height: data.height?.toString() || '',
          gender: data.gender || '',
          image: data.image || '',
        });
        setDate(userDOB);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setUser({ ...user, dob: selectedDate.toISOString().split('T')[0] });
    }
    setShowPicker(false);
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required to access media library!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImageFile(image);
      setUser({ ...user, image: image.uri });
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', user.username);
    formData.append('email', user.email);
    formData.append('dob', user.dob);
    formData.append('gender', user.gender);
    formData.append('height', user.height);
    formData.append('weight', user.weight);

    if (imageFile) {
      formData.append('image', {
        uri: imageFile.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const success = await updateUserDetails(formData);
    if (success) {
      alert('Profile updated!');
      router.push('/(tabs)/profile');
    } else {
      alert('Update failed!');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="mt-4 text-gray-500 font-medium">Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      {/* Header with improved shadow and padding */}
      <View className="bg-white flex-row items-center p-5 shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center rounded-full"
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-center text-xl flex-1 font-bold text-[#333]">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-8 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image with animation hint */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleImagePick}
            className="relative"
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: user.image || 'https://via.placeholder.com/100' }}
              className="w-[120px] h-[120px] rounded-full border-3 border-[#FF6F00]"
            />
            <View className="absolute bottom-0 right-0 bg-[#FF6F00] p-2 rounded-full shadow-md">
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-center text-[#FF6F00] font-medium mt-3">
            Change Profile Photo
          </Text>
        </View>

        {/* Form section with card-like appearance */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <Text className="text-lg font-bold text-[#333] mb-4">Personal Information</Text>

          {/* Username */}
          <View className="mb-5">
            <Text className="mb-2 text-[#555] font-medium">Username</Text>
            <TextInput
              value={user.username}
              onChangeText={(val) => setUser({ ...user, username: val })}
              placeholder="Enter username"
              className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#333] bg-[#F9F9F9]"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text className="mb-2 text-[#555] font-medium">Email</Text>
            <TextInput
              value={user.email}
              onChangeText={(val) => setUser({ ...user, email: val })}
              placeholder="Enter email"
              className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#333] bg-[#F9F9F9]"
              keyboardType="email-address"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* DOB with Date Picker */}
          <View className="mb-5">
            <Text className="mb-2 text-[#555] font-medium">Date of Birth</Text>
            <Pressable onPress={toggleDatepicker}>
              <View className="border border-[#E0E0E0] rounded-xl px-4 py-3 bg-[#F9F9F9] flex-row items-center justify-between">
                <Text className="text-[#333]">{user.dob || 'Select Date'}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </View>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                maximumDate={new Date()}
                themeVariant="light"
              />
            )}
          </View>

          {/* Gender */}
          <View className="mb-5">
            <Text className="mb-2 text-[#555] font-medium">Gender</Text>
            <TextInput
              value={user.gender}
              onChangeText={(val) => setUser({ ...user, gender: val })}
              placeholder="Enter gender"
              className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#333] bg-[#F9F9F9]"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Body Metrics section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-8">
          <Text className="text-lg font-bold text-[#333] mb-4">Body Metrics</Text>

          {/* Height and Weight in a row */}
          <View className="flex-row mb-2">
            {/* Height */}
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-[#555] font-medium">Height (cm)</Text>
              <TextInput
                value={user.height}
                onChangeText={(val) => {
                  const num = Number(val);

                  if (!isNaN(num) && num > 0) {
                    setUser({ ...user, height: val });
                  } else if (val === "") {
                    setUser({ ...user, height: "" });
                  }
                  // Invalid input (0, negative, non-numeric) is ignored
                }}
                placeholder="Enter height"
                keyboardType="number-pad"
                className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#333] bg-[#F9F9F9]"
                placeholderTextColor="#999"
              />

            </View>

            {/* Weight */}
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-[#555] font-medium">Weight (kg)</Text>
              <TextInput
                value={user.weight}
                onChangeText={(val) => {
                  // Convert input to number
                  const num = Number(val);

                  // Check if input is a positive number greater than 0
                  if (!isNaN(num) && num > 0) {
                    setUser({ ...user, weight: val });
                  } else if (val === "") {
                    // Allow clearing the input
                    setUser({ ...user, weight: "" });
                  }
                  // Do nothing if value is 0 or negative
                }}
                placeholder="Enter weight"
                keyboardType="number-pad"
                className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#333] bg-[#F9F9F9]"
                placeholderTextColor="#999"
              />

            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          className="mt-2 bg-[#FF6F00] py-4 rounded-xl items-center shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateUser;