import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"
import Navbar from "../components/Navbar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export default function UserLocationScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [address, setAddress] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("user_role")
      const safewheel_id = await AsyncStorage.getItem("safewheel_id")

      if (!safewheel_id) {
        setLoading(false)
        return
      }
     

      if (role === "guardian") {
        try {
          const response = await axios.get("https://find-it-bersama-dia-safe-wheel.vercel.app/api/user_location", {
            params: { safewheel_id },
          })

          const { latitude, longitude } = response.data
          setLocation({ latitude, longitude })
          

          const geo = await Location.reverseGeocodeAsync({ latitude, longitude })
          if (geo.length > 0) {
            const { street, district, subregion, city, region } = geo[0]
            const formatted = `${street ?? ""}, ${district ?? ""}, ${subregion ?? ""}, ${city ?? ""}, ${region ?? ""}`
            setAddress(formatted)
          }
        } catch (err) {
          console.error("Guardian location fetch error:", err)
        } finally {
          setLoading(false)
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          alert("Permission to access location was denied")
          setLoading(false)
          return
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        })

        const { latitude, longitude } = loc.coords
        setLocation({ latitude, longitude })

        const geo = await Location.reverseGeocodeAsync({ latitude, longitude })
        if (geo.length > 0) {
          const { street, district, subregion, city, region } = geo[0]
          const formatted = `${street ?? ""}, ${district ?? ""}, ${subregion ?? ""}, ${city ?? ""}, ${region ?? ""}`
          setAddress(formatted)
        }

        setLoading(false)
      }
    })()
  }, [])

  const openGoogleMaps = () => {
    if (location) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`)
    }
  }

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#493d9e" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        >
          <Ionicons name="location" size={30} color="#5E3DB4" />
        </Marker>
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.title}>You are here!</Text>
        <Ionicons name="location-outline" size={32} color="#A28EFF" style={{ marginBottom: 6 }} />
        <Text style={styles.address}>{address || "Memuat alamat..."}</Text>

        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <Text style={styles.buttonText}>View Google Maps</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: "#f9f7ff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A4BBC",
    marginBottom: 10,
    textAlign: "center",
  },
  address: {
    fontSize: 16,
    color: "#4a4a4a",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#493d9e",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})