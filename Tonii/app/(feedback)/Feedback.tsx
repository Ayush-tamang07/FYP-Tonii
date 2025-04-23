import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { dropdownOptions } from '../../constants/dropdownOptions';
import apiHandler from '@/context/APIHandler';
import { sendFeedback } from '@/context/userAPI';

const Feedback = () => {
    const [feedbackType, setFeedbackType] = useState('');
    const [description, setDescription] = useState('');

    const submitFeedback = async () => {
        try {
            if (!feedbackType || !description) {
                Alert.alert("Error", "Fill all fields");
                return;
            }
    
            const response = await sendFeedback( feedbackType, description);
    
            if (response.status === 201) {
                Alert.alert("Success", "Feedback submitted successfully!");
                setFeedbackType('');
                setDescription('');
            } else {
                Alert.alert("Success", response.message);
            }
            router.push('/(tabs)/profile')
        } catch (error) {
            console.error("Error submitting feedback:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    return (
        <ScrollView className='bg-white'>
            <View className='bg-white flex-row items-center p-4'>
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <MaterialIcons name='arrow-back' size={24} color='black' />
                </TouchableOpacity>
                <Text className='text-center text-2xl flex-1 font-semibold'>Feedback</Text>
            </View>

            <View>
                <View className='mx-4 mb-4'>
                    <RNPickerSelect
                        onValueChange={(value) => setFeedbackType(value)}
                        items={dropdownOptions.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                        placeholder={{ label: 'Select feedback type', value: null }}
                        style={{
                            inputIOS: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: '#d1d5db',
                                borderRadius: 8,
                                color: 'black',
                                backgroundColor: '#f3f4f6',
                                paddingRight: 30,
                                marginTop: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 1,
                            },
                            inputAndroid: {
                                fontSize: 16,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                borderWidth: 1,
                                borderColor: '#d1d5db',
                                borderRadius: 8,
                                color: 'black',
                                backgroundColor: '#f3f4f6',
                                paddingRight: 30,
                                marginTop: 8,
                            },
                            iconContainer: {
                                top: 20,
                                right: 10,
                            },
                        }}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => <MaterialIcons name='arrow-drop-down' size={24} color='#71717a' />}
                    />
                </View>

                <TextInput
                    className='border border-gray-300 m-4 p-4 h-40 text-base rounded-lg shadow-sm bg-gray-100 focus:border-blue-500 focus:bg-white'
                    placeholder='Your feedback...'
                    multiline
                    textAlignVertical='top'
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />

                <TouchableOpacity className='bg-blue-600 m-4 p-4 rounded-lg shadow-md active:bg-blue-700' onPress={submitFeedback}>
                    <Text className='text-white text-center font-semibold text-lg'>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Feedback;
