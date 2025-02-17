import { Link } from 'expo-router';
import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, SafeAreaView } from 'react-native';
import { RadioButton } from 'react-native-paper';

export class Register extends Component {
  state = {
    gender: 'male', // Default gender selection
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

        <Text>UserName</Text>
        <TextInput style={styles.input} placeholder="Enter your username" />

        <Text>Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />

        <Text>Date of Birth</Text>
        <TextInput style={styles.input} placeholder="DOB" keyboardType="email-address" />

        {/* Gender Selection with Radio Buttons */}
        <Text>Gender</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton
              value="male"
              status={this.state.gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => this.setState({ gender: 'male' })}
            />
            <Text>Male</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="female"
              status={this.state.gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => this.setState({ gender: 'female' })}
            />
            <Text>Female</Text>
          </View>
        </View>

        <Text>Password</Text>
        <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />

        <Text>Confirm Password</Text>
        <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry />

        <Link href="/(auth)/login">
          <Text style={styles.link}>Already a member? Login</Text>
        </Link>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
  link: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Register;
