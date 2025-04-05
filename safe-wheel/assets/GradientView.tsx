import type React from "react"
import { View, StyleSheet } from "react-native"

interface GradientViewProps {
  children: React.ReactNode
  style?: object
}

export default function GradientView({ children, style }: GradientViewProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Gradient layers from bottom to top */}
      <View style={styles.gradientBottom} />
      <View style={styles.gradientMiddle} />
      <View style={styles.gradientTop} />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#ffffff", // Base color (top of gradient)
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Almost white at top
  },
  gradientMiddle: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(200, 191, 255, 0.5)", // Light purple in middle
  },
  gradientBottom: {
    position: "absolute",
    top: "60%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(178, 165, 255, 0.7)", // Stronger purple at bottom
  },
})

