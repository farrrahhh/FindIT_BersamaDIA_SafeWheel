// pages/SignupGuardian.tsx
"use client"

import { useState } from "react"
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Alert,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/AppNavigator.tsx"
import { Feather } from "@expo/vector-icons"

type SignupNavigationProp = StackNavigationProp<RootStackParamList, "SignupGuardian">

interface Props {
  navigation: SignupNavigationProp
}

export default function SignupGuardian({ navigation }: Props) {
  const [formData, setFormData] = useState({
    safewheel_id: "",
    guardian_email: "",
    guardian_password: "",
    guardian_name: "",
  })

  const [errors, setErrors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => prev.filter(err => err !== field))
  }

  const validateForm = () => {
    const err = []
    if (!formData.safewheel_id) err.push("safewheel_id")
    if (!formData.guardian_email.includes("@")) err.push("guardian_email")
    if (formData.guardian_password.length < 8) err.push("guardian_password")
    if (!formData.guardian_name) err.push("guardian_name")

    setErrors(err)
    return err.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const response = await fetch("https://find-it-bersama-dia-safe-wheel.vercel.app/api/signup/guardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        Alert.alert("Success", "Guardian registered successfully", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ])
      } else {
        Alert.alert("Failed", data.message || "Signup failed")
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.")
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundBase} />
      <Image
        source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ellipse%201-EM2yPl1ZNPz6MpoMyLUCP3QRxXs9Jx.png" }}
        style={styles.backgroundEllipse}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={28} color="#493d9e" />
        </TouchableOpacity>

          <Text style={styles.header}>Sign Up as Guardian</Text>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="SafeWheel ID"
              placeholderTextColor="#a99fd6"
              style={[styles.input, errors.includes("safewheel_id") && styles.inputError]}
              value={formData.safewheel_id}
              onChangeText={(text) => updateField("safewheel_id", text)}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#a99fd6"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errors.includes("guardian_email") && styles.inputError]}
              value={formData.guardian_email}
              onChangeText={(text) => updateField("guardian_email", text)}
            />
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#a99fd6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.input, styles.passwordInput, errors.includes("guardian_password") && styles.inputError]}
                value={formData.guardian_password}
                onChangeText={(text) => updateField("guardian_password", text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeButton}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#493d9e" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#a99fd6"
              style={[styles.input, errors.includes("guardian_name") && styles.inputError]}
              value={formData.guardian_name}
              onChangeText={(text) => updateField("guardian_name", text)}
            />
          </View>

          <View style={{ marginTop: 40 }} /> {/* Spacer added here */}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Create Account</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backgroundBase: { ...StyleSheet.absoluteFillObject, backgroundColor: "#f0e6ff" },
  backgroundEllipse: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  scroll: { flexGrow: 1 },
  safeArea: { padding: 20, flex: 1 },
  backButton: { 
    marginBottom: 20,
    marginLeft: 20,
},
  header: {
    fontSize: 30,
    color: "#493d9e",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: { 
    gap: 20,
    paddingHorizontal: 20,
},
  input: {
    backgroundColor: "#f5f3ff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#493d9e",
    borderColor: "#ccc",
    borderWidth: 2,
  },
  inputError: { borderColor: "#ff6b6b" },
  passwordWrapper: { position: "relative" },
  passwordInput: { paddingRight: 40 },
  eyeButton: { position: "absolute", right: 10, top: "50%", transform: [{ translateY: -12 }] },
  submitButton: {
    backgroundColor: "#22177a",
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 20, 
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "600" },
})