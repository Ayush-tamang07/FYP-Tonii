import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
// import { registerUser } from '../../context/userAPI';
import apiHandler from '@/context/APIHandler';
import axios from 'axios';
// import * as SecureStore from "expo-secure-store";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    weight: "",
    height: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const onRegisterPress = async () => {
    if (!form.email || !form.password || !form.username || !form.weight || !form.dob || !form.height || !form.gender || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const payload = { username: form.username, email: form.email, password: form.password, weight: form.weight, dob: form.dob, height: form.height, gender: form.gender, confirmPassword: form.confirmPassword }
    console.log(payload)
    try {
      const result = await apiHandler.post("/auth/register", payload);
      if (result?.status === 201) {
        Alert.alert("Registration Successful", "You have been registered successfully. Please login.");
        router.push("../(auth)/login");
      } else if (result?.status === 409) {
        Alert.alert("Error", "This email is already registered. Please login instead.");
      } else {
        Alert.alert("Error", result.data?.message || "Invalid credentials");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert("Registration Failed", error.response.data?.error || "An unexpected error occurred.");
      } else if (error instanceof Error) {
        Alert.alert("Registration Failed", error.message);
      } else {
        Alert.alert("Registration Failed", "An unknown error occurred.");
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🏋️</Text>
      </View>
      <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

      <Text>User Name</Text>
      <TextInput style={styles.input} placeholder="Enter your username" value={form.username} onChangeText={(text) => setForm({ ...form, username: text })} />

      <Text>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />

      <Text>Age</Text>
      <TextInput style={styles.input} placeholder="age" keyboardType="number-pad" value={form.dob} onChangeText={(text) => setForm({ ...form, dob: text })} />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Height</Text>
          <TextInput style={styles.input} placeholder="in cm" keyboardType="number-pad" value={form.height} onChangeText={(text) => setForm({ ...form, height: text })} />
        </View>
        <View style={styles.column}>
          <Text>Weight</Text>
          <TextInput style={styles.input} placeholder="in kg" keyboardType="number-pad" value={form.weight} onChangeText={(text) => setForm({ ...form, weight: text })} />
        </View>
      </View>

      <Text>Gender</Text>
      <TextInput style={styles.input} placeholder="Enter gender" value={form.gender} onChangeText={(text) => setForm({ ...form, gender: text })} />

      <Text>Password</Text>
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry value={form.password} onChangeText={(text) => setForm({ ...form, password: text })} />

      <Text>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={form.confirmPassword} onChangeText={(text) => setForm({ ...form, confirmPassword: text })} />

      <View style={styles.termsContainer}>
        <TouchableOpacity style={styles.checkbox}></TouchableOpacity>
        <Text style={styles.termsText}>By checking the box you agree to our <Text style={styles.termsLink}>Terms and Conditions.</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Link href="/(auth)/login">
        <Text style={styles.link}>Already a member? <Text style={styles.loginText}>Login</Text></Text>
      </Link>
    </SafeAreaView>
  );
};

export default Register;




const { width } = Dimensions.get('window'); // Get screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 40,
    color: '#FF6909',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: '#FF6909',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%", // Make inputs responsive
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: "100%",
  },
  column: {
    flex: 1, // Makes each column take equal space
    marginRight: width > 400 ? 10 : 5, // Adjust margin based on screen size
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 3,
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
  },
  termsLink: {
    color: '#FF6909',
    fontWeight: 'bold',
  },
  link: {
    textAlign: "center",
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  loginText: {
    color: "#FF6909",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: '#FF6909',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


