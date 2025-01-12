import { Link } from 'expo-router';
import React, { Component } from 'react';
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import Toast from "react-native-toast-message";
import { useState } from "react";
// import * as SecureStore from "expo-secure-store";
import { registerUser } from "@/context/userAPI";

const Register = () => {
    const router = useRouter();

    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleRegister = () => {
    // const { name, email, password } = this.state;
    // console.log('Name:', name);
    // console.log('Email:', email);
    // console.log('Password:', password);
    try {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Validation Error", 
          text2: "Please fill in all fields.",
        });
        return;
      }
      // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Please enter a valid email address",
          });
          return;
        }
  
      if (form.password !== form.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Passwords do not match.",
        });
        return;
      }
  
        const result = await registerUser(form.name, form.email, form.password , form.confirmPassword);
        if (result?.status == 201) {
          await SecureStore.setItemAsync("AccessToken", result.token);
          console.log(result.token);
          Toast.show({
            type: "success", 
            text1: "Success",
            text2: "Account created successfully! Please login.",
            visibilityTime: 1000,
            onHide: () => {
              router.replace("../(auth)/sign_in");
            }
          });
        } else {
          Alert.alert("Error", "Invalid credentials");
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
        });
      }
    
  };

    return (
      <View style={styles.container}>
              <Image
                source={require('../../assets/images/app_icon.png')} 
                style={styles.image}
              />
        <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Ayush Tamang"
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Conform Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.linkContainer}>
          <Text>Already have an account?</Text>
          <Text style={styles.linkText}> Login</Text>
        </Link>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width:120, // Adjust the width of the image
    marginBottom: 16, // Add spacing between the image and the title
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FF6909', // Matched with Login component
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
  button: {
    backgroundColor: '#FF6909', // Matched with Login component
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', // Matches the width of the input fields
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
    color: '#FF6909', // Matched with Login component
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default Register;

