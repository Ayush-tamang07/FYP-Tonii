import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { fetchUserDetails } from '../../context/userAPI'; // Import the function

const userDetails = () => {
  const [user, setUser] = useState({
    username: '', 
    email: '',
    weight: '',
    dob: '',
    height: '',
    gender: '',
  });

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails(); // Fetch user details
      if (data && data.username) {
        setUser({
          username: data.username || '',
          email: data.email || '',
          weight: data.weight ? data.weight.toString() : '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '', // Extracting only the date
          height: data.height ? data.height.toString() : '',
          gender: data.gender || '',
        });
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Image and Name */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqSTTueKdjM4z7B0u5Gqx5UFUZjqtL3_8QhQ&s' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{user.username}</Text>
      </View>

      {/* User Details */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={user.username} editable={false} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value={user.email} editable={false} />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.box}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.inputBox} value={user.dob} editable={false} />
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Weight</Text>
          <TextInput style={styles.inputBox} value={user.weight} editable={false} />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.box}>
          <Text style={styles.label}>Height</Text>
          <TextInput style={styles.inputBox} value={user.height} editable={false} />
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.inputBox} value={user.gender} editable={false} />
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
  },
  inputBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default userDetails;
