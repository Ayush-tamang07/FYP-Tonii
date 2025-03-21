import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Dimensions, TouchableOpacity, Platform, Image } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#FF6F00" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Media Container - Shows either video or static image */}
        <View style={[
          styles.mediaContainer, 
          videoAspectRatio === 'portrait' 
            ? { height: width * 1.3 } // Reduced height for portrait to avoid excessive scrolling
            : { height: width * 0.5625 }  // 16:9 ratio for landscape
        ]}>
          {videoLoading && !useStaticImage && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6F00" />
            </View>
          )}
          
          {videoSource && !useStaticImage ? (
            <WebView
              ref={webViewRef}
              source={{ html: getVideoHtml(videoSource) }}
              style={styles.video}
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
              style={styles.exerciseImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.noMediaContainer}>
              <FontAwesome5 name="dumbbell" size={40} color="#E0E0E0" />
              <Text style={styles.noMediaText}>No media available</Text>
            </View>
          )}
        </View>

        {/* Exercise Details */}
        {loading ? (
          <View style={styles.contentLoadingContainer}>
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text style={styles.loadingText}>Loading exercise details...</Text>
          </View>
        ) : exerciseDetails ? (
          <View style={styles.detailsContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.exerciseName}>{exerciseDetails.name}</Text>
              <View style={[
                styles.difficultyBadge, 
                { backgroundColor: getDifficultyColor(exerciseDetails.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>{exerciseDetails.difficulty}</Text>
              </View>
            </View>

            <View style={styles.infoCardsContainer}>
              <View style={styles.infoCard}>
                <Ionicons name="body-outline" size={24} color="#FF6F00" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardLabel}>Muscle Group</Text>
                  <Text style={styles.infoCardValue}>{exerciseDetails.category}</Text>
                </View>
              </View>
              
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="arm-flex" size={24} color="#FF6F00" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardLabel}>Target Muscle</Text>
                  <Text style={styles.infoCardValue}>{exerciseDetails.muscle}</Text>
                </View>
              </View>
              
              <View style={styles.infoCard}>
                <FontAwesome5 name="running" size={22} color="#FF6F00" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardLabel}>Exercise Type</Text>
                  <Text style={styles.infoCardValue}>{exerciseDetails.type}</Text>
                </View>
              </View>
              
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="dumbbell" size={24} color="#FF6F00" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardLabel}>Equipment</Text>
                  <Text style={styles.infoCardValue}>{exerciseDetails.equipment}</Text>
                </View>
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.instructions}>{exerciseDetails.instructions}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
            <Text style={styles.errorText}>Exercise not found.</Text>
            <TouchableOpacity 
              style={styles.goBackButton}
              onPress={() => router.back()}
            >
              <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  favoriteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 10,
  },
  contentLoadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  noMediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noMediaText: {
    marginTop: 12,
    fontSize: 16,
    color: "#757575",
  },
  loadingText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  difficultyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoCardText: {
    marginLeft: 12,
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: "#757575",
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555555",
    textAlign: "justify",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#555555",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  goBackButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  goBackButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
  },
});