import type React from "react"
import { View, StyleSheet } from "react-native"

interface CustomGradientBackgroundProps {
  children: React.ReactNode
}

// Alternative gradient implementation using multiple layers with opacity
export default function CustomGradientBackground({ children }: CustomGradientBackgroundProps) {
  return (
    <View style={styles.container}>
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />
      <View style={styles.gradientLayer3} />
      <View style={styles.gradientLayer4} />
      <View style={styles.gradientLayer5} />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b2a5ff",
    opacity: 0.1,
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b2a5ff",
    opacity: 0.2,
    top: "20%",
  },
  gradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b2a5ff",
    opacity: 0.3,
    top: "40%",
  },
  gradientLayer4: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b2a5ff",
    opacity: 0.4,
    top: "60%",
  },
  gradientLayer5: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b2a5ff",
    opacity: 0.5,
    top: "80%",
  },
})

