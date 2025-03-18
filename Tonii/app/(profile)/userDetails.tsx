import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { fetchUserDetails } from '../../context/userAPI';

const userDetails = () => {
  const [user, setUser] = useState({
    username: '', 
    email: '',
    weight: '',
    dob: '',
    height: '',
    gender: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data && data.username) {
        setUser({
          username: data.username || '',
          email: data.email || '',
          weight: data.weight ? data.weight.toString() : '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          height: data.height ? data.height.toString() : '',
          gender: data.gender || '',
        });
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);
  
  // Calculate age from DOB if available
  const calculateAge = (dob) => {
    if (!dob) return '';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Edit Profile Button - Positioned at the top right */}
        <TouchableOpacity style={styles.editProfileButton}>
          <MaterialIcons name="edit" size={20} color="#FF6F00" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Profile Image and Name */}
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqSTTueKdjM4z7B0u5Gqx5UFUZjqtL3_8QhQ&s' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <MaterialIcons name="photo-camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.username}</Text>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={18} color="#666" style={styles.inputIcon} />
                <Text style={styles.label}>Full Name</Text>
              </View>
              <TextInput 
                style={styles.input} 
                value={user.username} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="email" size={18} color="#666" style={styles.inputIcon} />
                <Text style={styles.label}>Email Address</Text>
              </View>
              <TextInput 
                style={styles.input} 
                value={user.email} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="cake" size={18} color="#666" style={styles.inputIcon} />
                <Text style={styles.label}>Date of Birth</Text>
              </View>
              <TextInput 
                style={styles.input} 
                value={user.dob} 
                editable={false}
                placeholder="Not provided"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="body-outline" size={18} color="#666" style={styles.inputIcon} />
                <Text style={styles.label}>Gender</Text>
              </View>
              <TextInput 
                style={styles.input} 
                value={user.gender} 
                editable={false}
                placeholder="Not provided"
              />
            </View>
          </View>
        </View>

        {/* Body Metrics Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Body Metrics</Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.metricsContainer}>
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <FontAwesome name="balance-scale" size={16} color="#FF6F00" />
                </View>
                <Text style={styles.metricValue}>{user.weight || '--'}</Text>
                <Text style={styles.metricLabel}>Weight (kg)</Text>
              </View>
              
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <MaterialIcons name="height" size={16} color="#FF6F00" />
                </View>
                <Text style={styles.metricValue}>{user.height || '--'}</Text>
                <Text style={styles.metricLabel}>Height (cm)</Text>
              </View>
              
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <Ionicons name="calendar-outline" size={16} color="#FF6F00" />
                </View>
                <Text style={styles.metricValue}>{calculateAge(user.dob) || '--'}</Text>
                <Text style={styles.metricLabel}>Age (years)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editProfileText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6F00',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6F00',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
  }
});

export default userDetails;