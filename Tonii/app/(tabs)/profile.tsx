import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Profile Image and Name */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqSTTueKdjM4z7B0u5Gqx5UFUZjqtL3_8QhQ&s' }} // Replace with actual user image
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Rabin Rai</Text>
      </View>

      {/* User Details */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value="Rabin Rai" editable={false} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value="rar0396@gmail.com" editable={false} />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.box}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.inputBox} value="20" editable={false} />
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Weight</Text>
          <TextInput style={styles.inputBox} value="64" editable={false} />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.box}>
          <Text style={styles.label}>Height</Text>
          <TextInput style={styles.inputBox} value="5'6”" editable={false} />
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.inputBox} value="Male" editable={false} />
        </View>
      </View>


    </View>
  );
};

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
  }
});

export default Profile;
