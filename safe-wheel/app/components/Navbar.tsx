import React from "react"
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"

export default function Navbar() {
  return (
    <View style={styles.container}>
      {/* Kiri */}
      <TouchableOpacity style={[styles.iconButton, { marginLeft: 30 }]}>
        <Ionicons name="compass" size={28} color="#4B3EA8" />
      </TouchableOpacity>

      {/* Tengah */}
      <View style={styles.centerIconWrapper}>
        <View style={styles.diamond}>
          <Feather name="home" size={28} color="#4B3EA8" style={styles.homeIcon} />
        </View>
      </View>

      {/* Kanan */}
      <TouchableOpacity style={[styles.iconButton, { marginRight: 30 }]}>
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
  homeIcon: {
    transform: [{ rotate: "-45deg" }],
  },
})