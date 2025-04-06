"use client"

import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Linking, Alert } from "react-native"
import Navbar from "../components/Navbar.tsx"

export default function Emergency() {
  const emergencyNumber = "082245822451"
  const handleSOSPress = async () => {
    const phoneURL = `tel:${emergencyNumber}`

    const supported = await Linking.canOpenURL(phoneURL)

    if (supported) {
        Linking.openURL(phoneURL)
    } else {
        Alert.alert("Error", "This device cannot make phone calls.")
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <TouchableOpacity style={styles.sosOuterCircle} onPress={handleSOSPress}>
          <View style={styles.sosInnerCircle}>
            <Text style={styles.sosText}>SOS</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Keep Calm!</Text>
        <Text style={styles.subtitle}>
          After pressing SOS button, wheelchair user{"\n"}
          will get help immediately!
        </Text>
      </View>

      {/* Navbar tetap di bawah */}
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sosOuterCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#D7CFF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  sosInnerCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#48359C",
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5A35C0",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})