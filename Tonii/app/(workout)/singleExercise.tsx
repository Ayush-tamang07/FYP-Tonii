import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import apiHandler from "@/context/APIHandler";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  category: string;
  type:string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

const SingleExercise = () => {
  const { id } = useLocalSearchParams();
  const [exerciseDetails, setExerciseDetails] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Container */}
      <View style={styles.videoContainer}>
        <WebView
          source={{
            uri: "https://www.shutterstock.com/shutterstock/videos/3710163749/preview/stock-footage-rocky-pull-up-pulldown-back-exercise-workout-animation-video-training-guide.webm",
          }}
          allowsFullscreenVideo
          style={styles.video}
          webViewProps={{
            allowsInlineMediaPlayback: true,
          }}
        />
      </View>

      {/* Exercise Details */}
      {loading ? (
        <Text style={styles.loadingText}>Loading exercise details...</Text>
      ) : exerciseDetails ? (
        <>
          <Text style={styles.heading}>Exercise Name: {exerciseDetails.name}</Text>
          <Text style={styles.heading}>Muscle: {exerciseDetails.category}</Text>
          <Text style={styles.heading}>Sub Muscle: {exerciseDetails.muscle}</Text>
          <Text style={styles.heading}>Type: {exerciseDetails.type}</Text>
          <Text style={styles.heading}>Equipment: {exerciseDetails.equipment}</Text>
          <Text style={styles.heading}>Difficulty: {exerciseDetails.difficulty}</Text>
          <Text style={styles.instruction_heading}>Instruction: {exerciseDetails.instructions}</Text>
        </>
      ) : (
        <Text style={styles.errorText}>Exercise not found.</Text>
      )}
    </SafeAreaView>
  );
};

export default SingleExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 19,
  },
  videoContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderRadius: 3,
  },
  video: {
    flex: 1,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  instruction_heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "justify",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
