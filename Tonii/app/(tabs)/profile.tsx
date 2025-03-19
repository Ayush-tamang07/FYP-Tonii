import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { fetchUserDetails } from '../../context/userAPI';
import { router } from 'expo-router';

const profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await fetchUserDetails();
      if (data) {
        setUser({
          username: data.username || '',
          email: data.email || '',
        });
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqSTTueKdjM4z7B0u5Gqx5UFUZjqtL3_8QhQ&s' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Feather name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.profileName}>{user.username}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push("/(profile)/userDetails")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.editIconBg]}>
            <MaterialIcons name="edit" size={18} color="white" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" style={styles.arrowIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.iconContainer, styles.settingsIconBg]}>
            <Feather name="settings" size={18} color="white" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" style={styles.arrowIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.iconContainer, styles.feedbackIconBg]}>
            <Feather name="message-square" size={18} color="white" />
          </View>
          <Text style={styles.menuText}>Feedback</Text>
          <Feather name="chevron-right" size={18} color="#c0c0c0" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      
      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={18} color="white" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
      
      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  profileCard: {
    alignItems: 'center',
    // backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    // borderRadius: 12,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: "#777",
    marginTop: 3,
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginLeft: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  editIconBg: {
    backgroundColor: '#3498db',
  },
  settingsIconBg: {
    backgroundColor: '#2ecc71',
  },
  feedbackIconBg: {
    backgroundColor: '#9b59b6',
  },
  menuText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  loadingText: {
    marginTop: 10,
    color: '#777',
    fontSize: 15,
  },
});

export default profile;