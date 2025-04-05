import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export default function LandingPage() {
  // Load fonts asynchronously
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
  });

  // Local loading state
  const [, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsReady(true); // Set state to true when fonts are ready
    }
  }, [fontsLoaded]);


  return (
    <View className="flex-1 items-center justify-center bg-transparent">
      {/* Background Blur Layer */}
      <BlurView
        intensity={90}
        tint="light"
        style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, borderRadius: 40 }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(178,165,255,0.82)',
            borderRadius: 40,
          }}
        />
      </BlurView>

      <BlurView
        intensity={90}
        tint="light"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 80,
          height: 80,
          borderRadius: 40,
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(178,165,255,0.82)',
            borderRadius: 40,
          }}
        />
      </BlurView>

      <Text className="font-poppinsSemiBold text-4xl text-black">SafeWheel</Text>

      <Image source={require('../assets/wheelchair.png')} style={{ width: 180, height: 180 }} />

      <TouchableOpacity
        className="bg-primary mt-4 rounded-lg px-6 py-3"
        onPress={() => console.log('Login')}>
        <Text className="text-2xl text-white">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-primary mt-4 rounded-lg px-6 py-3"
        onPress={() => console.log('SignUp')}>
        <Text className="text-2xl text-white">SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}
