import { Link } from 'expo-router';
import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

export class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  handleRegister = () => {
    const { name, email, password } = this.state;
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  render() {
    return (
      <View style={styles.container}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
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
