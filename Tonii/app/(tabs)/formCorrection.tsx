
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const FormCorrection = () => {
  const { width } = useWindowDimensions();
  
  // Calculate responsive card dimensions
  const screenPadding = 32; // 16px on each side
  const cardWidth = width - screenPadding;
  const cardHeight = cardWidth * 0.6; // Adjust aspect ratio as needed

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Text className="text-2xl font-bold text-gray-800 ml-5 ">Form Correction</Text>
      
      {/* Main exercise card with improved UI */}
      <TouchableOpacity
        onPress={() => router.push('/(postercorrection)/CameraScreen')}
        className="mt-5 ml-5 mb-4 rounded-3xl overflow-hidden"
        style={{
          width: cardWidth,
          height: cardHeight,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}
      >
        <Image
          source={{ uri: 'https://images.ctfassets.net/hjcv6wdwxsdz/KT4PpNyA0f5BM0u9o6oPH/8bf552d8c327f777e7d9cb28904e7615/squats-claudia-hold.png' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        
        {/* Gradient overlay for better text visibility */}
        <View className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70" />
        
        {/* Card content */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-white text-2xl font-bold mb-1">Squat</Text>
          <View className="flex-row items-center mb-2">
            <View className="bg-green-500 rounded-full h-2 w-2 mr-2" />
            <Text className="text-white text-sm">Perfect your form</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xs opacity-80">Targets: Quads, Glutes, Core</Text>
            <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Text className="text-white text-xs font-medium">Begin</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FormCorrection;