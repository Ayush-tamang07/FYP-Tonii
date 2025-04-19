// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';

// const CameraScreen = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const devices = useCameraDevices();
//   const device = devices.back;

//   useEffect(() => {
//     const checkPermission = async () => {
//       const newCameraPermission = await Camera.requestCameraPermission();
//       setHasPermission(newCameraPermission === 'authorized');
//       console.log('Camera permission:', newCameraPermission);
//     };

//     checkPermission();
//   }, []);

//   if (!hasPermission || device == null) return <ActivityIndicator />;

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera 
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />
//     </View>
//   );
// };

// export default CameraScreen;
