import { View, Text, SafeAreaView, ActivityIndicator, Dimensions, TouchableOpacity, Platform, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import apiHandler from "@/context/APIHandler";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  category: string;
  type: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  videoUrl: string;
  imageUrl?: string; // Optional field for static image fallback
}

const { width } = Dimensions.get("window");

const SingleExercise = () => {
  const { id } = useLocalSearchParams();
  const [exerciseDetails, setExerciseDetails] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>('landscape'); // 'landscape' or 'portrait'
  const [useStaticImage, setUseStaticImage] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const response = await apiHandler.get(`/exercise-details/${id}`);
        setExerciseDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExerciseDetails();
    }
  }, [id]);

  // Helper function to determine difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FFC107';
      case 'advanced':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  // Check if we have a video URL from the API data
  const videoSource = exerciseDetails?.videoUrl || "";
  const imageSource = exerciseDetails?.imageUrl;
  
  // Function to detect video orientation from metadata
  useEffect(() => {
    if (videoSource) {
      // Simple detection based on URL patterns
      if (
        videoSource.includes('portrait') || 
        videoSource.includes('vertical') || 
        videoSource.includes('9by16') ||
        videoSource.includes('9:16')
      ) {
        setVideoAspectRatio('portrait');
      } else {
        setVideoAspectRatio('landscape');
      }
    }
  }, [videoSource]);

  // Custom HTML to handle video aspect ratio properly
  const getVideoHtml = (src: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              overflow: hidden; 
              background-color: #000; 
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            video {
              ${videoAspectRatio === 'portrait' 
                ? 'height: 100%; max-width: 100%; object-fit: contain;' 
                : 'width: 100%; height: 100%; object-fit: contain;'}
              background-color: #000;
            }
          </style>
        </head>
        <body>
          <video 
            id="exerciseVideo" 
            controls 
            playsinline
            autoplay="false"
            preload="auto"
            poster="about:blank"
          >
            <source src="${src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <script>
            // Make sure video is properly sized
            const video = document.getElementById('exerciseVideo');
            video.addEventListener('loadedmetadata', function() {
              // Handle video orientation based on actual video dimensions
              if (video.videoHeight > video.videoWidth) {
                video.style.height = '100%';
                video.style.width = 'auto';
              } else {
                video.style.width = '100%';
                video.style.height = 'auto';
              }
            });
            
            // Handle video errors
            video.addEventListener('error', function() {
              window.ReactNativeWebView.postMessage('VIDEO_ERROR');
            });
            
            video.addEventListener('loadeddata', function() {
              window.ReactNativeWebView.postMessage('VIDEO_LOADED');
            });
          </script>
        </body>
      </html>
    `;
  };
  
  // Handle WebView messages
  const handleWebViewMessage = (event: any) => {
    const { data } = event.nativeEvent;
    
    if (data === 'VIDEO_ERROR') {
      setUseStaticImage(true);
      setVideoLoading(false);
    } else if (data === 'VIDEO_LOADED') {
      setVideoLoading(false);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-[12px] pb-3 border-b border-gray-100">
        <TouchableOpacity 
          className="p-2" 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Exercise Details</Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="heart-outline" size={24} color="#FF6F00" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Media Container - Shows either video or static image */}
        <View 
          className="w-full bg-black relative"
          style={{
            height: videoAspectRatio === 'portrait' ? width * 1.3 : width * 0.5625
          }}
        >
          {videoLoading && !useStaticImage && (
            <View className="absolute inset-0 justify-center items-center bg-black z-10">
              <ActivityIndicator size="large" color="#FF6F00" />
            </View>
          )}
          
          {videoSource && !useStaticImage ? (
            <WebView
              ref={webViewRef}
              source={{ html: getVideoHtml(videoSource) }}
              className="flex-1 bg-black"
              onMessage={handleWebViewMessage}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onError={() => setUseStaticImage(true)}
              onHttpError={() => setUseStaticImage(true)}
            />
          ) : imageSource ? (
            <Image
              source={{ uri: imageSource }}
              className="w-full h-full bg-gray-100"
              resizeMode="contain"
            />
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-100">
              <FontAwesome5 name="dumbbell" size={40} color="#E0E0E0" />
              <Text className="mt-3 text-base text-gray-500">No media available</Text>
            </View>
          )}
        </View>

        {/* Exercise Details */}
        {loading ? (
          <View className="p-10 items-center">
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text className="mt-4 text-base text-gray-500">Loading exercise details...</Text>
          </View>
        ) : exerciseDetails ? (
          <View className="p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[22px] font-bold text-gray-800 flex-1">{exerciseDetails.name}</Text>
              <View 
                className="px-3 py-1.5 rounded-full ml-2.5"
                style={{ backgroundColor: getDifficultyColor(exerciseDetails.difficulty) }}
              >
                <Text className="text-xs font-semibold text-white">{exerciseDetails.difficulty}</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between mb-6">
              <View className="flex-row items-center w-[48%] bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <Ionicons name="body-outline" size={24} color="#FF6F00" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-500">Muscle Group</Text>
                  <Text className="text-sm font-semibold text-gray-800 mt-0.5">{exerciseDetails.category}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center w-[48%] bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <MaterialCommunityIcons name="arm-flex" size={24} color="#FF6F00" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-500">Target Muscle</Text>
                  <Text className="text-sm font-semibold text-gray-800 mt-0.5">{exerciseDetails.muscle}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center w-[48%] bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <FontAwesome5 name="running" size={22} color="#FF6F00" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-500">Exercise Type</Text>
                  <Text className="text-sm font-semibold text-gray-800 mt-0.5">{exerciseDetails.type}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center w-[48%] bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <MaterialCommunityIcons name="dumbbell" size={24} color="#FF6F00" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-gray-500">Equipment</Text>
                  <Text className="text-sm font-semibold text-gray-800 mt-0.5">{exerciseDetails.equipment}</Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">Instructions</Text>
              <Text className="text-[15px] leading-6 text-gray-600 text-justify">{exerciseDetails.instructions}</Text>
            </View>
          </View>
        ) : (
          <View className="items-center justify-center p-10">
            <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
            <Text className="text-lg text-gray-600 text-center mt-4 mb-4">Exercise not found.</Text>
            <TouchableOpacity 
              className="bg-gray-100 py-3 px-6 rounded-xl mt-4"
              onPress={() => router.back()}
            >
              <Text className="text-base font-semibold text-gray-800">Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleExercise;