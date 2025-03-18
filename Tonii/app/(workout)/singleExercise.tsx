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
}

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * 0.5625; // 16:9 aspect ratio

const SingleExercise = () => {
  const { id } = useLocalSearchParams();
  const [exerciseDetails, setExerciseDetails] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [videoSource, setVideoSource] = useState<string>("");
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const response = await apiHandler.get(`/exercise-details/${id}`);
        setExerciseDetails(response.data.data);
        
        // In a real app, you'd get the video source from your API
        // For now we're setting a sample video
        setVideoSource("https://www.shutterstock.com/shutterstock/videos/3710163749/preview/stock-footage-rocky-pull-up-pulldown-back-exercise-workout-animation-video-training-guide.webm");
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

  // Function to handle YouTube videos
  const getWebViewContent = (src: string) => {
    // Check if the source is a YouTube URL
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const youtubeId = src.includes('youtube.com') 
        ? src.split('v=')[1].split('&')[0]
        : src.split('youtu.be/')[1];
        
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
              .container { position: relative; width: 100%; height: 100%; }
              iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <div class="container">
              <iframe 
                src="https://www.youtube.com/embed/${youtubeId}?playsinline=1&autoplay=0&rel=0" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </body>
        </html>
      `;
    } else {
      // For direct video sources like mp4, webm
      return null;
    }
  };

  const isYoutubeVideo = videoSource.includes('youtube.com') || videoSource.includes('youtu.be');
  
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
        {/* Video Container */}
        <View style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}>
          {videoLoading && (
            <View style={styles.videoLoadingContainer}>
              <ActivityIndicator size="large" color="#FF6F00" />
            </View>
          )}
          
          {videoSource ? (
            isYoutubeVideo ? (
              <WebView
                ref={webViewRef}
                source={{ html: getWebViewContent(videoSource) || '' }}
                style={[styles.video, videoLoading ? { opacity: 0 } : { opacity: 1 }]}
                onLoadEnd={() => setVideoLoading(false)}
                allowsFullscreenVideo
                javaScriptEnabled
                domStorageEnabled
              />
            ) : (
              <WebView
                ref={webViewRef}
                source={{ uri: videoSource }}
                style={[styles.video, videoLoading ? { opacity: 0 } : { opacity: 1 }]}
                onLoadEnd={() => setVideoLoading(false)}
                allowsFullscreenVideo
                webViewProps={{
                  allowsInlineMediaPlayback: true,
                }}
              />
            )
          ) : (
            <View style={styles.noVideoContainer}>
              <FontAwesome5 name="dumbbell" size={40} color="#E0E0E0" />
              <Text style={styles.noVideoText}>No video available</Text>
            </View>
          )}
        </View>

        {/* Exercise Details */}
        {loading ? (
          <View style={styles.loadingContainer}>
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
            
            {/* Action Button */}
            {/* <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add to Workout</Text>
            </TouchableOpacity> */}
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
  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    flex: 1,
  },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noVideoText: {
    marginTop: 12,
    fontSize: 16,
    color: "#757575",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
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
  actionButton: {
    backgroundColor: "#FF6F00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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