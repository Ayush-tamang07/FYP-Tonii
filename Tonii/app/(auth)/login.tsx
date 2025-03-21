import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator,
  SafeAreaView, KeyboardAvoidingView, Platform
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import apiHandler from "@/context/APIHandler";

function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Added loading state

  const onSignInPress = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true); // Start loading

    const payload = { email: form.email, password: form.password };

    try {
      const result = await apiHandler.post("/auth/login",
        payload
      );

      if (result?.status === 200) {
        await SecureStore.setItemAsync("AccessToken", result.data.token);
        router.replace("../(tabs)/profile");
      } else {
        Alert.alert("Error", result.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Image 
                source={require("../../assets/images/app_icon.png")} 
                style={styles.image} 
                resizeMode="contain"
              />
              <Text style={styles.title}>WELCOME BACK</Text>
              <Text style={styles.subtitle}>Sign in to continue to your fitness journey</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, email: value })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>                
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={form.password}
                    onChangeText={(value) => setForm({ ...form, password: value })}
                    secureTextEntry
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={onSignInPress}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={styles.linkContainer}>
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <Text style={styles.linkTextBold}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF6909",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    paddingLeft: 4,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    overflow: "hidden",
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
    marginTop: 8,
  },
  forgotPassword: {
    color: "#FF6909",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FF6909",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#FF6909",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#FFAA80",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  linkText: {
    color: "#666",
    fontSize: 15,
  },
  linkTextBold: {
    color: "#FF6909",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Login;