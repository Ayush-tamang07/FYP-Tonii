import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light gray background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark gray text
  },
});

export default profile