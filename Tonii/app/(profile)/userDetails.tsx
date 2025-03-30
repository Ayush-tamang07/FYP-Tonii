import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { fetchUserDetails } from '../../context/userAPI';
import { router } from 'expo-router';

interface UserData {
  username: string;
  email: string;
  weight: string;
  dob: string;
  height: string;
  gender: string;
  image: string;
}

const userDetails = () => {
  const [user, setUser] = useState<UserData>({
    username: '', 
    email: '',
    weight: '',
    dob: '',
    height: '',
    gender: '',
    image:''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data && data.username) {
        setUser({
          username: data.username || '',
          email: data.email || '',
          weight: data.weight ? data.weight.toString() : '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          height: data.height ? data.height.toString() : '',
          gender: data.gender || '',
          image: data.image || '',
        });
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);
  
  // Calculate age from DOB if available
  const calculateAge = (dob: string): string => {
    if (!dob) return '';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F9FA]">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="mt-2.5 text-[#666666] text-base">Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className='bg-white flex-row items-center p-4'>
      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
        <Text className='text-center text-2xl flex-1 font-semibold'>User Details</Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-5 pb-8 relative"
      >
        {/* Edit Profile Button - Positioned at the top right */}
        <TouchableOpacity className="flex-row items-center self-end bg-white py-2 px-4 rounded-full mr-4 mb-2 shadow" onPress={()=> router.push("/(profile)/UpdateUser")}>
          <MaterialIcons name="edit" size={20} color="#FF6F00" />
          <Text className="ml-1.5 text-sm font-medium text-[#FF6F00]">Edit Profile</Text>
        </TouchableOpacity>

        {/* Profile Image and Name */}
        <View className="items-center py-6 bg-white mb-4 rounded-xl mx-4 shadow">
          <View className="relative mb-3">
            <Image
              source={{uri:user.image}}
              className="w-[100px] h-[100px] rounded-full border-3 border-white shadow"
            />
            {/* <TouchableOpacity className="absolute bottom-0 right-0 bg-[#FF6F00] rounded-full w-[30px] h-[30px] justify-center items-center border-2 border-white">
              <MaterialIcons name="photo-camera" size={20} color="#FFF" />
            </TouchableOpacity> */}
          </View>
          <Text className="text-2xl font-bold text-[#333333]">{user.username}</Text>
        </View>

        {/* Personal Information Card */}
        <View className="bg-white rounded-xl mx-4 mt-4 shadow overflow-hidden">
          <View className="flex-row justify-between items-center px-4 py-3.5 border-b border-[#F0F0F0]">
            <Text className="text-base font-semibold text-[#333333]">Personal Information</Text>
          </View>
          
          <View className="p-4">
            <View className="mb-4">
              <View className="flex-row items-center mb-1.5">
                <Ionicons name="person-outline" size={18} color="#666" className="mr-1.5" />
                <Text className="text-sm text-[#666666] font-medium">Full Name</Text>
              </View>
              <TextInput 
                className="bg-[#F5F5F5] px-3 py-2.5 rounded-lg text-[15px] text-[#333333] border border-[#EEEEEE]" 
                value={user.username} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1.5">
                <MaterialIcons name="email" size={18} color="#666" className="mr-1.5" />
                <Text className="text-sm text-[#666666] font-medium">Email Address</Text>
              </View>
              <TextInput 
                className="bg-[#F5F5F5] px-3 py-2.5 rounded-lg text-[15px] text-[#333333] border border-[#EEEEEE]" 
                value={user.email} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1.5">
                <MaterialIcons name="cake" size={18} color="#666" className="mr-1.5" />
                <Text className="text-sm text-[#666666] font-medium">Date of Birth</Text>
              </View>
              <TextInput 
                className="bg-[#F5F5F5] px-3 py-2.5 rounded-lg text-[15px] text-[#333333] border border-[#EEEEEE]" 
                value={user.dob} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1.5">
                <Ionicons name="body-outline" size={18} color="#666" className="mr-1.5" />
                <Text className="text-sm text-[#666666] font-medium">Gender</Text>
              </View>
              <TextInput 
                className="bg-[#F5F5F5] px-3 py-2.5 rounded-lg text-[15px] text-[#333333] border border-[#EEEEEE]" 
                value={user.gender} 
                editable={false}
                placeholder="Not provided"
              />
            </View>
          </View>
        </View>

        {/* Body Metrics Card */}
        <View className="bg-white rounded-xl mx-4 mt-4 shadow overflow-hidden">
          <View className="flex-row justify-between items-center px-4 py-3.5 border-b border-[#F0F0F0]">
            <Text className="text-base font-semibold text-[#333333]">Body Metrics</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between">
              <View className="flex-1 items-center p-3 bg-[#F8F9FA] rounded-lg mx-1 border border-[#EEEEEE]">
                <View className="w-8 h-8 rounded-full bg-[rgba(255,111,0,0.1)] justify-center items-center mb-2">
                  <FontAwesome name="balance-scale" size={16} color="#FF6F00" />
                </View>
                <Text className="text-lg font-bold text-[#333333] mb-1">{user.weight || '--'}</Text>
                <Text className="text-xs text-[#666666]">Weight (kg)</Text>
              </View>
              
              <View className="flex-1 items-center p-3 bg-[#F8F9FA] rounded-lg mx-1 border border-[#EEEEEE]">
                <View className="w-8 h-8 rounded-full bg-[rgba(255,111,0,0.1)] justify-center items-center mb-2">
                  <MaterialIcons name="height" size={16} color="#FF6F00" />
                </View>
                <Text className="text-lg font-bold text-[#333333] mb-1">{user.height || '--'}</Text>
                <Text className="text-xs text-[#666666]">Height (cm)</Text>
              </View>
              
              <View className="flex-1 items-center p-3 bg-[#F8F9FA] rounded-lg mx-1 border border-[#EEEEEE]">
                <View className="w-8 h-8 rounded-full bg-[rgba(255,111,0,0.1)] justify-center items-center mb-2">
                  <Ionicons name="calendar-outline" size={16} color="#FF6F00" />
                </View>
                <Text className="text-lg font-bold text-[#333333] mb-1">{calculateAge(user.dob) || '--'}</Text>
                <Text className="text-xs text-[#666666]">Age (years)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default userDetails;