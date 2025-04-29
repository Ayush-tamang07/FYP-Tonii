import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useRootNavigationState } from 'expo-router'; // 👈 Added useRootNavigationState
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializationNotification } from '@/context/notification';
import { jwtDecode } from 'jwt-decode';
import AuthService from '@/context/AuthContext';
import { ActivityIndicator, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const navigationState = useRootNavigationState(); 
  useEffect(() => {
    initializationNotification();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AuthService.getToken();
      const isExpired = await AuthService.isTokenExpired();

      if (!token || isExpired) {
        await AuthService.removeToken();
        setIsAuthenticated(false);
      } else {
        const decoded: any = jwtDecode(token);
        const userId = decoded?.userId;
        setIsAuthenticated(true);
      }
    } catch (error) {
      await AuthService.removeToken();
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 🚨 Now handle redirection AFTER Navigation is Ready + Fonts loaded + Auth checked
  useEffect(() => {
    if (!navigationState?.key) return; // Wait until navigation is ready
    if (fontsLoaded && isAuthenticated !== null) {
      SplashScreen.hideAsync();
      
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [navigationState?.key, fontsLoaded, isAuthenticated]);

  if (isAuthenticated === null || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(workout)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="(feedback)" options={{ headerShown: false }} />
          <Stack.Screen name="(streak)" options={{ headerShown: false }} />
          <Stack.Screen name="(resetPassword)" options={{ headerShown: false }} />
          <Stack.Screen name="(notification)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
