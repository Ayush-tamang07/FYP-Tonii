// import { View, Text, ActivityIndicator,StyleSheet } from 'react-native'
// import React, { useEffect } from 'react'
// import {Camera, useCameraDevices} from 'react-native-vision-camera'

// const formCorrection = () => {
//   const devices = useCameraDevices()
//   const device = devices.back

//   // const { hasPermission } = useCameraPermission()
//   useEffect(()=>{
//     checkPermission()
//   },[])
//   const checkPermission = async()=>{
//     const newCameraPermission = await Camera.requestCameraPermission()
//     // const microphonePermission = await Camera.getMicrophonePermissionStatus()
//     console.log(newCameraPermission);
//   }
//   if (device == null) return <ActivityIndicator />

//   return (
//     <View className='flex:1'>
//       <Camera 
//       style={StyleSheet.absoluteFill}
//       device={device}
//       isActive={true}
//     />
//     </View>
//   )
// }

// export default formCorrection
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React from 'react';

const FormCorrection = () => {
  const { width } = useWindowDimensions();
  
  // Calculate responsive card dimensions
  const screenPadding = 32; // 16px on each side
  const cardWidth = width - screenPadding;
  const cardHeight = cardWidth * 0.6; // Adjust aspect ratio as needed

  return (
    <View className="flex-1 bg-slate-50 pt-6 px-4">
      <Text className="text-3xl font-bold text-gray-800 mb-6">Form Correction</Text>
      
      {/* Main exercise card with improved UI */}
      <TouchableOpacity
        onPress={() => console.log('Card pressed')}
        className="mb-4 rounded-3xl overflow-hidden"
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
    </View>
  );
};

export default FormCorrection;