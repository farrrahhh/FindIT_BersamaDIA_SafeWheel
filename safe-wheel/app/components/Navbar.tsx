import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.ts"

export default function Navbar() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const handleNavigateCompass = () => {
    console.log("Navigate to UserLocation")
    navigation.navigate("UserLocation")
  }

  const handleNavigateHome = () => {
    console.log("Navigate to Homepage")
    navigation.navigate("Homepage")
  }

  const handleNavigatePhone = () => {
    console.log("Navigate to Emergency/SOS")
    navigation.navigate("Emergency")
  }

  return (
    <View style={styles.container}>
      {/* Kiri */}
      <TouchableOpacity
        style={[styles.iconButton, { marginLeft: 30 }]}
        onPress={handleNavigateCompass}
      >
        <Ionicons name="compass" size={28} color="#4B3EA8" />
      </TouchableOpacity>

      {/* Tengah */}
      <View style={styles.centerIconWrapper}>
      <TouchableOpacity onPress={handleNavigateHome}>
        <View style={styles.diamond}>
          <View style={styles.iconFix}>
            <Feather name="home" size={28} color="#4B3EA8" />
          </View>
        </View>
      </TouchableOpacity>
      </View>

      {/* Kanan */}
      <TouchableOpacity
        style={[styles.iconButton, { marginRight: 30 }]}
        onPress={handleNavigatePhone}
      >
        <Feather name="phone" size={28} color="#4B3EA8" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F0FF",
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#D6CBF7",
    borderRadius: 25,
  },
  centerIconWrapper: {
    position: "absolute",
    top: -30,
    left: "50%",
    transform: [{ translateX: -30 }],
    zIndex: 10,
  },
  diamond: {
    width: 60,
    height: 60,
    backgroundColor: "#F3F0FF",
    transform: [{ rotate: "45deg" }],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
    borderRadius: 12,
  },
  
  iconFix: {
    transform: [{ rotate: "-45deg" }],
  },
  
  
})
// Ensure only one default export exists
export { Navbar }