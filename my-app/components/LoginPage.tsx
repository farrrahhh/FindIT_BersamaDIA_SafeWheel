"use client"

import { useState } from "react"
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Alert
} from "react-native"
import axios from "axios"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/AppNavigator" // Ensure this file exists or update the path
// If the file doesn't exist, create it with the following content:
// export type RootStackParamList = {
//   Login: undefined;
//   Landing: undefined;
//   Signup: undefined;
// };
// If the file doesn't exist, create it or adjust the path accordingly.
import { styled } from "nativewind"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface LoginFormData {
  email: string
  password: string
}

interface Props {
  navigation: LoginScreenNavigationProp
}

export default function Loginpage({ navigation }: Props) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)

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

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.includes(field)) {
      if (isFieldValid(field, value)) {
        setErrors((prevErrors) => prevErrors.filter((e) => e !== field))
      }
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.email.includes("@")) newErrors.push("email")
    if (formData.password.length < 8) newErrors.push("password")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const response = await axios.post("https://find-it-bersama-dia-safe-wheel.vercel.app/api/login", {
        user_email: formData.email,
        user_password: formData.password
      })

      if (response.data && response.data.user) {
        navigation.navigate("Landing")
      } else {
        Alert.alert("Login failed", "Invalid credentials")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      Alert.alert("Login failed", error?.response?.data?.message || "Server error")
    }
  }

  return (
    <StyledView className="flex-1 bg-white justify-center">
      <StatusBar barStyle="dark-content" />
      <StyledView className="absolute inset-0 bg-violet-100" />
      <StyledImage
        source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ellipse%201-EM2yPl1ZNPz6MpoMyLUCP3QRxXs9Jx.png" }}
        className="absolute top-0 right-0 w-full h-1/2"
        resizeMode="cover"
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView className="flex-1 px-5 pb-10 justify-center">
          <StyledTouchableOpacity onPress={() => navigation.goBack()} className="ml-2 p-2">
            <StyledText className="text-2xl text-violet-800">←</StyledText>
          </StyledTouchableOpacity>

          <StyledText className="text-4xl font-bold text-violet-900 text-center my-8">Log In</StyledText>

          <StyledView className="mb-6">
            <StyledText className="text-base text-violet-600 mb-2 ml-2 font-semibold">Email</StyledText>
            <StyledTextInput
              className={`bg-violet-50 rounded-xl px-4 py-4 text-base text-violet-900 border-2 mx-2 ${
                errors.includes("email") ? "border-red-400" : "border-black"
              }`}
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#a99fd6"
            />
            {errors.includes("email") && (
              <StyledText className="text-red-500 text-sm mt-1 ml-2">Please enter a valid email</StyledText>
            )}
          </StyledView>

          <StyledView className="mb-6">
            <StyledText className="text-base text-violet-600 mb-2 ml-2 font-semibold">Password</StyledText>
            <StyledView className="relative">
              <StyledTextInput
                className={`bg-violet-50 rounded-xl px-4 py-4 text-base text-violet-900 border-2 mx-2 pr-10 ${
                  errors.includes("password") ? "border-red-400" : "border-black"
                }`}
                value={formData.password}
                onChangeText={(text: string) => updateField("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholder="Enter your password"
                placeholderTextColor="#a99fd6"
              />
              <StyledTouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-4"
                accessibilityLabel="Toggle password visibility"
              >
                <StyledText className="text-lg">{showPassword ? "🙈" : "👁"}</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            {errors.includes("password") && (
              <StyledText className="text-red-500 text-sm mt-1 ml-2">Password must be at least 8 characters</StyledText>
            )}
          </StyledView>

          <StyledTouchableOpacity
            className="rounded-full bg-violet-900 py-4 mx-2 mb-5"
            onPress={handleSubmit}
            accessibilityLabel="Log In"
          >
            <StyledText className="text-white text-center text-lg font-semibold">Log In</StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            className="items-center mt-4"
          >
            <StyledText className="text-base text-violet-600">
              Don't have an account? <StyledText className="text-violet-900 font-semibold">Sign Up</StyledText>
            </StyledText>
          </StyledTouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </StyledView>
  )
}
