import { Link } from 'expo-router';
import React, { useState } from 'react';
import { loginUser } from '@/context/userAPI';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from 'axios';


const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:5500/api/user/login', {
        email: form.email,
        password: form.password,
      });
      return response.data; // Handle token or user data
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // const onSignInPress = async () => {
  //   // Validate form fields
  //   if (!form.email || !form.password) {
  //     Alert.alert("Error", "Please fill in all fields");
  //     return;
  //   }

  //   try {
  //     console.log(form);
  //     const result = await loginUser(form.email, form.password);
  //     console.log(result);
  //     console.log("status code : ", result.status);
  //     if (result?.status == 200) {
  //       await SecureStore.setItemAsync("AccessToken", result.token);
  //       router.replace("../(tabs)/home");

  //     } else {
  //       Alert.alert("Error", "Invalid credentials");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Error", "Login failed. Please try again.");
  //   }
  // };
  // const handleLogin = () => {
  //   // Logic for handling login
  //   console.log('Email:', email);
  //   console.log('Password:', password);
  // };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/app_icon.png')}
        style={styles.image}
      />
      <Text style={styles.title}>WELCOME BACK</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(value: any) => setForm({ ...form, email: value })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChangeText={(value: any) => setForm({ ...form, password: value })}
          secureTextEntry
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forget Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Link href="/(auth)/register" style={styles.linkContainer}>
        <Text>Don't have an account?</Text>
        <Text style={styles.linkText}> Sign Up</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 120, // Adjust the width of the image
    marginBottom: 16, // Add spacing between the image and the title
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 90,
    color: '#FF6909',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: '#FF6909',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6909',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', // Matches the width of the input field
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#FF6909',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default Login;
