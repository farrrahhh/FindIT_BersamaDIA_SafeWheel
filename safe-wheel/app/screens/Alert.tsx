import React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.tsx"
import fall from "../../assets/images/fall.png"
export default function Alert() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.alertTitle}>Alert!!</Text>

      <Image
        source={fall} 
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.description}>See Mattheuw’s{"\n"}Location Fast!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("UserLocation")} 
      >
        <Text style={styles.buttonText}>View Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  alertTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#7B4EF7",
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  description: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7B4EF7",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#493d9e",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})