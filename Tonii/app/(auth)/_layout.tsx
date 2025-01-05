import { Stack } from "expo-router";
import { StatusBar } from "react-native";
// import "../../global.css";
import Toast from "react-native-toast-message";
import React from "react";

const Layout = () => {
    return (
        <>
            {/* Set StatusBar globally */}
            <StatusBar
                barStyle="dark-content"
                backgroundColor="white"
                translucent={false}  
            />
            {/* Define Stack Navigator */}
            <Stack>
                {/* <Stack.Screen name="welcome" options={{ headerShown: false }} /> */}
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
            <Toast />
        </>
    );
};

export default Layout;
