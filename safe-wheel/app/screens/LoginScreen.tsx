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
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/AppNavigator.tsx"
import { Feather } from "@expo/vector-icons"
import axios from "axios"
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface LoginFormData {
  email: string
  password: string
}

interface Props {
  navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)

  // Check if a field value is valid
  const isFieldValid = (field: keyof LoginFormData, value: string) => {
    switch (field) {
      case "email":
        return value.includes("@")
      case "password":
        return value.length >= 8
      default:
        return true
    }
  }

  // Update a field and remove its error if it now passes validation
  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.includes(field)) {
      if (isFieldValid(field, value)) {
        setErrors((prevErrors) => prevErrors.filter((e) => e !== field))
      }
    }
  }

  // Validate the form and return true if valid
  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.email.includes("@")) newErrors.push("email")
    if (formData.password.length < 8) newErrors.push("password")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      const response = await axios.post(
        "https://find-it-bersama-dia-safe-wheel.vercel.app/api/login",
        {
          user_email: formData.email,
          user_password: formData.password,
        }
      )
  
      if (response.status === 200) {
        console.log("Login Success:", response.data)
        navigation.navigate("Landing")
      } else {
        console.warn("Login failed:", response.data.message || "Invalid credentials")
        alert(response.data.message || "Login failed")
      }
    } catch (error: any) {
      console.error("Error:", error)
      alert(error?.response?.data?.message || "Login error occurred")
    }
  }

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Log In</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.includes("email") && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => updateField("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#a99fd6"
              />
              {errors.includes("email") && (
                <Text style={styles.errorText}>Please enter a valid email</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.includes("password") && styles.inputError,
                  ]}
                  value={formData.password}
                  onChangeText={(text) => updateField("password", text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholder="Enter your password"
                  placeholderTextColor="#a99fd6"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                  accessibilityLabel="Toggle password visibility"
                >
                  <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#493d9e"
                />
                </TouchableOpacity>
              </View>
              {errors.includes("password") && (
                <Text style={styles.errorText}>Password must be at least 8 characters</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              accessibilityLabel="Log In"
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={styles.signupLink}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
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
  scrollContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#493d9e",
    marginVertical: 30,
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#8174a0",
    marginBottom: 8,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#f5f3ff",
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: "#493d9e",
    borderWidth: 2,
    borderColor: "black",
    fontFamily: "sans-serif",
    marginLeft: 10,
    marginRight: 10,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
    color: "#493d9e",
    marginTop: -7,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "sans-serif",
    marginLeft: 10,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 60,
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#22177a",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "sans-serif-medium",
  },
  signupLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#8174a0",
    fontSize: 16,
    marginBottom: 150,
  },
  signupHighlight: {
    color: "#493d9e",
    fontWeight: "600",
  },
  backButton: {
    marginLeft: 10,
    padding: 10,
  },
  backText: {
    fontSize: 28,
    color: "#493d9e",
  },
})