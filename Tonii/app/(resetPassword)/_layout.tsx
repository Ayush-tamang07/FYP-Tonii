import React from "react";
import { Stack } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import back button icon
import { useRouter } from "expo-router";
import "../../global.css";
// import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
  const router = useRouter();

  return (
    <GestureHandlerRootView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="white" translucent={false} />

      <Stack>
        <Stack.Screen name="Reset" options={{ headerShown: false }} />
        <Stack.Screen name="Verification" options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" options={{ headerShown: false }} />
      </Stack>
      {/* <Toast /> */}
    </GestureHandlerRootView>

  );
};

export default Layout;
