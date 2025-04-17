import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { 
  Text, 
  TextInput, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Alert, 
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import apiHandler from '@/context/APIHandler';
import axios from 'axios';
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  
  const onChange = (event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setForm({ ...form, dob: selectedDate.toISOString().split("T")[0] }); // Format as YYYY-MM-DD
    }
    setShowPicker(false); // Hide picker after selection
  };
  
  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    setForm({ ...form, gender: gender });
  };

  const onRegisterPress = async () => {
    if (!form.email || !form.password || !form.username || !form.weight || !form.dob || !form.height || !form.gender || !form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields",
      });
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = ["gmail.com"];
    const emailParts = form.email.split("@");
  
    if (
      emailParts.length !== 2 ||
      !emailRegex.test(form.email) ||
      !allowedDomains.includes(emailParts[1].toLowerCase()) 
    ) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please use an email with an allowed domain",
      });
      return;
    }
  
    // Convert DOB to a valid JavaScript Date object
    const formattedDOB = new Date(form.dob).toISOString(); // Ensure ISO format
  
    const payload = { 
      username: form.username, 
      email: form.email, 
      password: form.password, 
      weight: parseFloat(form.weight), // Ensure it's a number
      dob: formattedDOB, // Properly formatted DOB
      height: parseInt(form.height), // Ensure integer
      gender: form.gender, 
      confirmPassword: form.confirmPassword 
    };
  
    setLoading(true);
    
    try {
      const result = await apiHandler.post("/auth/register", payload);
      if (result?.status === 201) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "You have been registered successfully. Please login.",
        });
        router.push("../(auth)/login");
      } else if (result?.status === 409) {
        Alert.alert("Error", "This email is already registered. Please login instead.");
      } else {
        Alert.alert("Error", result.data?.message || "Invalid credentials");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert("Registration Failed", error.response.data?.error || "An unexpected error occurred.");
      } else if (error instanceof Error) {
        Alert.alert("Registration Failed", error.message);
      } else {
        Alert.alert("Registration Failed", "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image 
              source={require("../../assets/images/app_icon.png")} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
            <Text style={styles.subtitle}>Start your fitness journey today</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter your username" 
                  value={form.username} 
                  onChangeText={(text) => setForm({ ...form, username: text })} 
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter your email" 
                  value={form.email} 
                  onChangeText={(text) => setForm({ ...form, email: text })} 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <Pressable onPress={toggleDatepicker}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select Date of Birth"
                    value={form.dob}
                    editable={false}
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  maximumDate={new Date()}
                  textColor="#000"
                  themeVariant="light"
                  style={styles.picker}
                />
              )}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="in cm"  
                    keyboardType="number-pad" 
                    value={form.height} 
                    onChangeText={(text) => setForm({ ...form, height: text })} 
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>
              
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="in kg" 
                    keyboardType="number-pad" 
                    value={form.weight} 
                    onChangeText={(text) => setForm({ ...form, weight: text })} 
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    selectedGender === 'male' && styles.selectedGender
                  ]}
                  onPress={() => selectGender('male')}
                >
                  <Text style={[
                    styles.genderText,
                    selectedGender === 'male' && styles.selectedGenderText
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    selectedGender === 'female' && styles.selectedGender
                  ]}
                  onPress={() => selectGender('female')}
                >
                  <Text style={[
                    styles.genderText,
                    selectedGender === 'female' && styles.selectedGenderText
                  ]}>Female</Text>
                </TouchableOpacity>
                
                {/* <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    selectedGender === 'other' && styles.selectedGender
                  ]}
                  onPress={() => selectGender('other')}
                >
                  <Text style={[
                    styles.genderText,
                    selectedGender === 'other' && styles.selectedGenderText
                  ]}>Other</Text>
                </TouchableOpacity> */}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter password" 
                  secureTextEntry 
                  value={form.password} 
                  onChangeText={(text) => setForm({ ...form, password: text })} 
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Confirm password" 
                  secureTextEntry 
                  value={form.confirmPassword} 
                  onChangeText={(text) => setForm({ ...form, confirmPassword: text })} 
                  placeholderTextColor="#A0A0A0"
                />
              </View>
            </View>

            {/* <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox}></TouchableOpacity>
              <Text style={styles.termsText}>
                By checking the box you agree to our{' '}
                <Text style={styles.termsLink}>Terms and Conditions.</Text>
              </Text>
            </View> */}

            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]} 
              onPress={onRegisterPress}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.linkContainer}>
                <Text style={styles.linkText}>Already a member? </Text>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: '#FF6909',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: '#333',
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
    padding: 14,
    fontSize: 16,
    color: '#333',
    width: "100%",
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: "#F9F9F9",
  },
  selectedGender: {
    borderColor: "#FF6909",
    backgroundColor: "#FFF0EB",
  },
  genderText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#FF6909',
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 12,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  termsLink: {
    color: '#FF6909',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6909',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 15,
    color: '#666',
  },
  loginText: {
    color: "#FF6909",
    fontWeight: "bold",
    fontSize: 15,
  },
  picker: {
    backgroundColor: "white",
    marginTop: 8,
  }
});