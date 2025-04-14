"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Image, StatusBar, Animated, Dimensions } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "app/navigation/AppNavigator.tsx"

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">

interface Props {
  navigation: SplashScreenNavigationProp
}

export default function SplashScreen({ navigation }: Props) {
  // Animation values
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.9)

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Navigate to landing page after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace("Landing")
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Gradient */}
      <View style={styles.backgroundBase} />

      {/* Background Ellipse */}
      <Image
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ellipse%201-EM2yPl1ZNPz6MpoMyLUCP3QRxXs9Jx.png",
        }}
        style={styles.backgroundEllipse}
      />

      {/* Logo and Text Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo - directly without circle */}
        <Image
          source={{
            uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%282%29-gYjzuvFXxJ8zEhPbJevFddT0EKN3mu.png",
          }}
          style={styles.logoImage}
          accessibilityLabel="SafeWheel logo"
        />

        {/* App Name */}
        <Text style={styles.appName}>SafeWheel</Text>

        {/* Tagline with purple color */}
        <Text style={styles.tagline}>Move Freely, Live Safely</Text>
      </Animated.View>
    </View>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0e6ff",
  },
  backgroundEllipse: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
  },
  appName: {
    marginTop: 30,
    fontSize: 48,
    fontWeight: "bold",
    color: "#493d9e",
    fontFamily: "sans-serif",
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 10,
    fontSize: 18,
    color: "#6c3ce9", // Changed to a more vibrant purple to match the logo
    fontFamily: "sans-serif-medium",
    fontWeight: "500",
  },
})