import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator
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
      <View style={styles.container}>
        <Image source={require("../../assets/images/app_icon.png")} style={styles.image} />
        <Text style={styles.title}>WELCOME BACK</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType="email-address"
            autoCapitalize="none" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            secureTextEntry />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={onSignInPress}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.linkContainer}>
          <Text>Don't have an account?</Text>
          <Text style={styles.linkText}> Sign Up</Text>
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 90,
    color: "#FF6909",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
    color: "#FF6909",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF6909",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#FF6909",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default Login;
