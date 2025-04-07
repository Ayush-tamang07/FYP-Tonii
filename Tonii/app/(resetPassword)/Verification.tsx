import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Dimensions,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Vibration,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import apiHandler from '@/context/APIHandler'; // Update path as needed


const Verification: React.FC = () => {
    const params = useLocalSearchParams();
    const email = params.email as string;
    
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(360); // 6 minutes in seconds
    const [canResend, setCanResend] = useState<boolean>(false);
    
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const screenHeight = Dimensions.get('window').height;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start countdown timer
        startTimer();
        
        return () => {
            // Clear timer on unmount
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startTimer = () => {
        setCanResend(false);
        setTimer(360);
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerRef.current!);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCodeChange = (text: string, index: number): void => {
        if (!/^\d*$/.test(text)) return; // Accept only digits

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        Vibration.vibrate(10);

        if (text && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit if last digit is entered
        if (text && index === code.length - 1) {
            inputRefs.current[index]?.blur();
            // Allow a small delay before verification to give visual feedback
            setTimeout(() => {
                handleVerify();
            }, 300);
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ): void => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async ()=> {
        const otpCode = code.join('');
        
        if (otpCode.length !== 4) {
            Alert.alert('Error', 'Please enter the complete 4-digit code');
            return;
        }

        setLoading(true);
        try {
            const response = await apiHandler.post('/verifyOtp', { 
                email,
                otp: otpCode 
            });
            
            if (response.status === 200) {
                // Navigate to new password screen after verification
                router.push({
                    pathname: "/(resetPassword)/NewPassword",
                    params: { email }
                });
            }
        } catch (error) {
            const errorMessage = 'Invalid verification code. Please try again.';
            Alert.alert('Verification Failed', errorMessage);
            
            // Clear entered code on error
            setCode(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleBack = ()=> {
        router.push("/(auth)/login");
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        setLoading(true);
        try {
            const response = await apiHandler.post('/requestOtp', { email });
            
            if (response.status === 200) {
                startTimer();
                Alert.alert('Success', 'A new verification code has been sent');
                
                // Clear current code
                setCode(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            const errorMessage = 'Failed to resend code. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ minHeight: screenHeight }}>
            <SafeAreaView className="flex-1">
                <StatusBar barStyle="dark-content" />

                {/* Header */}
                <View className="px-4 pt-2 flex-row items-center">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="w-10 h-10 justify-center items-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="flex-1 px-5 justify-between">
                    <View className="pt-4">
                        <Text className="text-2xl font-semibold mb-1">Verification</Text>
                        <Text className="text-sm text-gray-500 mb-6">
                            We've sent the code to {email}
                        </Text>

                        {/* OTP Inputs */}
                        <View className="flex-row justify-center mb-6">
                            {code.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    className={`w-16 h-16 rounded-lg text-center text-2xl font-bold border ${
                                        digit
                                            ? 'border-pink-200 bg-white text-black'
                                            : 'border-gray-200 bg-white text-gray-800'
                                    } ${index < code.length - 1 ? 'mr-4' : ''}`}
                                    placeholder="•"
                                    placeholderTextColor="#ccc"
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={digit}
                                    editable={!loading}
                                    onChangeText={(text) => handleCodeChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 1,
                                        elevation: 1
                                    }}
                                />
                            ))}
                        </View>

                        <View className="flex-row justify-center mb-2">
                            <Text className="text-sm text-gray-500">Didn't receive the code? </Text>
                            <TouchableOpacity 
                                onPress={handleResendOTP}
                                disabled={!canResend || loading}
                            >
                                <Text 
                                    className={`text-sm font-medium ${canResend ? 'text-orange-500' : 'text-gray-400'}`}
                                >
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        {!canResend && (
                            <Text className="text-xs text-center text-gray-500 mb-4">
                                Resend available in {formatTime(timer)}
                            </Text>
                        )}
                    </View>

                    {/* Verify Button */}
                    <View className="pb-6 w-full">
                        <TouchableOpacity
                            className={`${loading ? 'bg-orange-400' : 'bg-orange-500'} py-3.5 rounded-lg mb-4 w-full`}
                            onPress={handleVerify}
                            disabled={loading || code.join('').length !== 4}
                        >
                            <Text className="text-white text-center font-semibold">
                                {loading ? 'Verifying...' : 'Verify'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Verification;