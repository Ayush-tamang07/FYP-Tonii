import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  FlatList, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import apiHandler from "@/context/APIHandler";

interface UserDetails {
  age: number | "";
  gender: string;
  height: number | "";
  weight: number | "";
}

interface UserPreferences {
  goal: string;
  experience: string;
  equipment: string;
  muscle: string;
}

interface Exercise {
  name: string;
  muscle: string;
  equipment: string;
  difficulty: string;
}

const Explore: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    age: "",
    gender: "male",
    height: "",
    weight: "",
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    goal: "",
    experience: "",
    equipment: "",
    muscle: "",
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined options for dropdown selections
  const goalOptions = ["lose weight", "build muscle", "strength", "endurance"];
  const experienceOptions = ["beginner", "intermediate", "advanced"];
  const equipmentOptions = ["none", "dumbbell", "barbell", "machine", "cable", "bodyweight"];
  const muscleOptions = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abs", "forearms", "calves"];

  const handleChange = (name: string, value: string | number, category: "details" | "preferences") => {
    if (category === "details") {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserPreferences((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMuscleSelection = (muscle: string) => {
    const currentMuscles = userPreferences.muscle ? userPreferences.muscle.split(',').map(m => m.trim()) : [];
    
    if (currentMuscles.includes(muscle)) {
      // Remove the muscle if already selected
      const updatedMuscles = currentMuscles.filter(m => m !== muscle).join(', ');
      setUserPreferences(prev => ({ ...prev, muscle: updatedMuscles }));
    } else {
      // Add the muscle if not already selected
      const updatedMuscles = [...currentMuscles, muscle].join(', ');
      setUserPreferences(prev => ({ ...prev, muscle: updatedMuscles }));
    }
  };

  const getSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Form validation
      if (!userDetails.age || !userDetails.height || !userDetails.weight) {
        setError("Please fill in all user details");
        setLoading(false);
        return;
      }
      
      if (!userPreferences.goal || !userPreferences.experience || !userPreferences.muscle) {
        setError("Please fill in all user preferences");
        setLoading(false);
        return;
      }

      // Convert numeric fields to numbers to ensure proper API handling
      const formattedUserDetails = {
        ...userDetails,
        age: typeof userDetails.age === "string" ? parseInt(userDetails.age) : userDetails.age,
        height: typeof userDetails.height === "string" ? parseInt(userDetails.height) : userDetails.height,
        weight: typeof userDetails.weight === "string" ? parseInt(userDetails.weight) : userDetails.weight
      };

      const response = await apiHandler.post(
        "/suggestion",
        {
          user_details: formattedUserDetails,
          user_preferences: userPreferences,
        }
      );
      
      console.log("API response:", response.data);
      
      // Check the structure of the response and extract the suggestions array
      if (response.data && response.data.suggestions) {
        setExercises(response.data.suggestions);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch workout suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Workout Planner</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={userDetails.age.toString()}
              onChangeText={(text) => handleChange("age", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.optionsRow}>
              {["male", "female", "other"].map(option => (
                <TouchableOpacity
                  key={`gender-${option}`}
                  style={[
                    styles.optionButton,
                    userDetails.gender === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange("gender", option, "details")}
                >
                  <Text style={[
                    styles.optionText,
                    userDetails.gender === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your height"
              keyboardType="numeric"
              value={userDetails.height.toString()}
              onChangeText={(text) => handleChange("height", text ? Number(text) : "", "details")}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={userDetails.weight.toString()}
              onChangeText={(text) => handleChange("weight", text ? Number(text) : "", "details")}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Preferences</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Goal</Text>
            <View style={styles.optionsRow}>
              {goalOptions.map(option => (
                <TouchableOpacity
                  key={`goal-${option}`}
                  style={[
                    styles.optionButton,
                    userPreferences.goal === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange("goal", option, "preferences")}
                >
                  <Text style={[
                    styles.optionText,
                    userPreferences.goal === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Experience Level</Text>
            <View style={styles.optionsRow}>
              {experienceOptions.map(option => (
                <TouchableOpacity
                  key={`experience-${option}`}
                  style={[
                    styles.optionButton,
                    userPreferences.experience === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange("experience", option, "preferences")}
                >
                  <Text style={[
                    styles.optionText,
                    userPreferences.experience === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Equipment</Text>
            <View style={styles.optionsWrap}>
              {equipmentOptions.map(option => (
                <TouchableOpacity
                  key={`equipment-${option}`}
                  style={[
                    styles.optionButton,
                    userPreferences.equipment === option && styles.selectedOption
                  ]}
                  onPress={() => handleChange("equipment", option, "preferences")}
                >
                  <Text style={[
                    styles.optionText,
                    userPreferences.equipment === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Muscles</Text>
            <View style={styles.optionsWrap}>
              {muscleOptions.map(muscle => (
                <TouchableOpacity
                  key={`muscle-${muscle}`}
                  style={[
                    styles.optionButton,
                    userPreferences.muscle.includes(muscle) && styles.selectedOption
                  ]}
                  onPress={() => handleMuscleSelection(muscle)}
                >
                  <Text style={[
                    styles.optionText,
                    userPreferences.muscle.includes(muscle) && styles.selectedOptionText
                  ]}>
                    {muscle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {userPreferences.muscle ? (
              <Text style={styles.selectionSummary}>
                Selected: {userPreferences.muscle}
              </Text>
            ) : (
              <Text style={styles.selectionHint}>Select one or more muscle groups</Text>
            )}
          </View>
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={getSuggestions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Generate Workout Plan</Text>
          )}
        </TouchableOpacity>
        
        {exercises.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Your Personalized Workout</Text>
            <FlatList
              data={exercises}
              keyExtractor={(item, index) => `exercise-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseDetail}>Muscle: {item.muscle}</Text>
                    <Text style={styles.exerciseDetail}>Equipment: {item.equipment}</Text>
                    <Text style={styles.exerciseDetail}>Difficulty: {item.difficulty}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          loading ? null : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Your workout recommendations will appear here
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedOption: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2",
  },
  optionText: {
    color: "#555",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  resultsSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  exerciseDetails: {
    gap: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: "#666",
  },
  selectionSummary: {
    marginTop: 8,
    fontSize: 14,
    color: "#4a90e2",
    fontWeight: "500",
  },
  selectionHint: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  }
});

export default Explore;