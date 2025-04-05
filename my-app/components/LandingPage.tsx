import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

export default function LandingPage() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
  });

  const [, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsReady(true);
    }
  }, [fontsLoaded]);

  return (
    <View style={styles.container}>
      {/* Background Blur Circles */}
      <BlurView intensity={90} tint="light" style={styles.topCircle}>
        <View style={styles.innerCircle} />
      </BlurView>

      <BlurView intensity={90} tint="light" style={styles.bottomCircle}>
        <View style={styles.innerCircle} />
      </BlurView>

      <Text style={styles.title}>SafeWheel</Text>

      <Image source={require('../assets/wheelchair.png')} style={styles.image} />

      <TouchableOpacity style={styles.button} onPress={() => console.log('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('SignUp')}>
        <Text style={styles.buttonText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  bottomCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(178,165,255,0.82)',
    borderRadius: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    fontFamily: 'PoppinsSemiBold',
    color: '#000',
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6C47FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'PoppinsRegular',
    color: '#fff',
    textAlign: 'center',
  },
});