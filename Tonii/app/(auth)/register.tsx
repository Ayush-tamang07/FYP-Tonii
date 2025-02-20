import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';

const Register = () => {
  const [gender, setGender] = useState('male'); // Manage gender state

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🏋️</Text>
      </View>
      <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

      <Text>User Name</Text>
      <TextInput style={styles.input} placeholder="Enter your username" />

      <Text>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email" />

      <Text>Date of Birth</Text>
      <TextInput style={styles.input} placeholder="DOB" keyboardType="number-pad" />

      {/* Height & Weight in Two Columns */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>Height</Text>
          <TextInput style={styles.input} placeholder="in cm" keyboardType="number-pad" />
        </View>
        <View style={styles.column}>
          <Text>Weight</Text>
          <TextInput style={styles.input} placeholder="in kg" keyboardType="number-pad" />
        </View>
      </View>

      {/* Gender Selection with Radio Buttons */}
      <Text>Gender</Text>
      <View style={styles.radioGroup}>
        <View style={styles.radioOption}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
          />
          <Text>Male</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>Female</Text>
        </View>
      </View>

      <Text>Password</Text>
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />

      <Text>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry />

      {/* Terms and Conditions Checkbox */}
      <View style={styles.termsContainer}>
        <TouchableOpacity style={styles.checkbox}></TouchableOpacity>
        <Text style={styles.termsText}>By checking the box you agree to our <Text style={styles.termsLink}>Terms and Conditions.</Text></Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Link href="/(auth)/login">
        <Text style={styles.link}>Already a member? <Text style={styles.loginText}>Login</Text></Text>
      </Link>
    </SafeAreaView>
  );
};

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

export default Register;
