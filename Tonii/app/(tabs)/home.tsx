import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";

const home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <Text style={styles.greeting}>Hi, [User's Name]!{"\n"}Ready to crush your goals today?</Text>

        {/* Pinned Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pin Workout</Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* Calorie Calculator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculate Calorie</Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Streak</Text>
          <View style={styles.placeholderBox} />
        </View>        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginTop:50
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Prevents bottom overflow due to navbar
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeholderBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quickActionButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#007BFF",
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  quickActionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default home;
