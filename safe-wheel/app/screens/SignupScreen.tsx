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
  type KeyboardTypeOptions,
  Image,
  StatusBar,
  Platform,
  Modal,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../navigation/AppNavigator.tsx"
import { Feather } from "@expo/vector-icons"

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">

interface FormData {
  safewheel_id: string;
  email: string
  password: string
  username: string
  sex: string
  dob: string
  bloodType: string
  emergencyNumber: string
}

interface Props {
  navigation: SignupScreenNavigationProp
}

export default function SignupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<FormData>({
    safewheel_id: "",
    email: "",
    password: "",
    username: "",
    sex: "",
    dob: "",
    bloodType: "",
    emergencyNumber: "",
  })

  const [errors, setErrors] = useState<string[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showSexDropdown, setShowSexDropdown] = useState(false)
  const [showBloodTypeDropdown, setShowBloodTypeDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const sexOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]

  const bloodTypeOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ]

  // Returns true if the given field's value is valid
  const isFieldValid = (field: keyof FormData, value: string) => {
    switch (field) {
      case "email":
        return value.includes("@")
      case "password":
        return value.length >= 8
      case "username":
        return value.length >= 3
      case "sex":
        return value.trim() !== ""
      case "dob":
        return value.trim() !== ""
      case "bloodType":
        return value.trim() !== ""
      case "emergencyNumber":
        return value.length >= 10
      default:
        return true
    }
  }

  // Updates a field and, if valid, removes its error from state
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.includes(field)) {
      if (isFieldValid(field, value)) {
        setErrors((prevErrors) => prevErrors.filter((e) => e !== field))
      }
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.safewheel_id) newErrors.push("safewheel_id")
    if (!formData.email.includes("@")) newErrors.push("email")
    if (formData.password.length < 8) newErrors.push("password")
    if (formData.username.length < 3) newErrors.push("username")
    if (!formData.sex) newErrors.push("sex")
    if (!formData.dob) newErrors.push("dob")
    if (!formData.bloodType) newErrors.push("bloodType")
    if (formData.emergencyNumber.length < 10) newErrors.push("emergencyNumber")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      const response = await fetch("https://find-it-bersama-dia-safe-wheel.vercel.app/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          safewheel_id: formData.safewheel_id,
          user_email: formData.email,
          user_password: formData.password,
          user_name: formData.username,
          sex: formData.sex,
          dob: formData.dob,
          bloodtype: formData.bloodType,
          emergency_number: formData.emergencyNumber,
          location_coordinates: "0,0"
        })
      })
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Account created successfully");
        navigation.navigate("Login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false)
      return
    }
    const currentDate = selectedDate || date
    setDate(currentDate)
    updateField("dob", formatDate(currentDate))
    setShowDatePicker(false)
  }

  const toggleDatepicker = () => {
    setShowDatePicker(true)
  }

  // Reusable input function; adds an eye button for password field
  const renderInputField = (
    label: string,
    field: keyof FormData,
    keyboardType?: KeyboardTypeOptions,
    secure?: boolean,
    placeholder?: string
  ) => {
    // Special case for password field
    // Inside your renderInputField function:

  // In your renderInputField function, update the password case as follows:

    if (field === "password") {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.includes(field) && styles.inputError
              ]}
              value={formData[field]}
              onChangeText={(text) => updateField(field, text)}
              keyboardType={keyboardType}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel={label}
              placeholder={placeholder || "Enter your password"}
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
          {errors.includes(field) && (
            <Text style={styles.errorText}>
              Please enter a valid {label.toLowerCase()}
            </Text>
          )}
        </View>
      )
    }

    // Default input for other fields
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, errors.includes(field) && styles.inputError]}
          value={formData[field]}
          onChangeText={(text) => updateField(field, text)}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize="none"
          accessibilityLabel={label}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          placeholderTextColor="#a99fd6"
        />
        {errors.includes(field) && <Text style={styles.errorText}>Please enter a valid {label.toLowerCase()}</Text>}
      </View>
    )
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.header}>Create Account</Text>

          <View style={styles.formContainer}>
          {renderInputField("SafeWheel ID", "safewheel_id", "default", false, "Enter your SafeWheel ID")}
            {renderInputField("Email", "email", "email-address", false, "Enter your email")}
            {renderInputField("Password", "password", undefined, true, "Enter your password")}
            {renderInputField("Username", "username", undefined, false, "Enter your username")}

            {/* Custom Sex Dropdown */}
            <View style={[styles.inputContainer, styles.dropdownContainer]}>
              <Text style={styles.label}>Sex</Text>
              <TouchableOpacity
                style={[styles.input, errors.includes("sex") && styles.inputError, styles.dropdownInput]}
                onPress={() => setShowSexDropdown((prev) => !prev)}
                accessibilityLabel="Select sex"
              >
                <Text style={formData.sex ? styles.textSelected : styles.placeholderText}>
                  {formData.sex ? formData.sex.charAt(0).toUpperCase() + formData.sex.slice(1) : "Choose..."}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showSexDropdown && (
                <View style={styles.dropdown}>
                  {sexOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        updateField("sex", option.value)
                        setShowSexDropdown(false)
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.includes("sex") && <Text style={styles.errorText}>Please select your sex</Text>}
            </View>

            {/* Date of Birth Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                onPress={toggleDatepicker}
                style={[styles.input, errors.includes("dob") && styles.inputError, styles.dateDisplay]}
                accessibilityLabel="Select date of birth"
              >
                <Text style={formData.dob ? styles.dateText : styles.datePlaceholder}>
                  {formData.dob || "Select date..."}
                </Text>
              </TouchableOpacity>
              {errors.includes("dob") && <Text style={styles.errorText}>Please select your date of birth</Text>}
            </View>

            {/* Render DateTimePicker for Android inline */}
            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}

            {/* iOS Modal for DateTimePicker */}
            {showDatePicker && Platform.OS === "ios" && (
              <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.doneButton}>
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            {/* Custom Blood Type Dropdown */}
            <View style={[styles.inputContainer, styles.dropdownContainer]}>
              <Text style={styles.label}>Blood Type</Text>
              <TouchableOpacity
                style={[styles.input, errors.includes("bloodType") && styles.inputError, styles.dropdownInput]}
                onPress={() => setShowBloodTypeDropdown((prev) => !prev)}
                accessibilityLabel="Select blood type"
              >
                <Text style={formData.bloodType ? styles.textSelected : styles.placeholderText}>
                  {formData.bloodType || "Choose..."}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showBloodTypeDropdown && (
                <View style={styles.dropdown}>
                  {bloodTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        updateField("bloodType", option.value)
                        setShowBloodTypeDropdown(false)
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.includes("bloodType") && <Text style={styles.errorText}>Please select your blood type</Text>}
            </View>

            {renderInputField("Emergency Number", "emergencyNumber", "phone-pad", false, "Enter your phone number")}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            accessibilityLabel="Create Account"
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
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
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
    padding: 10,
  },
  backText: {
    fontSize: 28,
    color: "#493d9e",
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
    marginLeft: 10,
    marginRight: 10,
  },
  dropdownContainer: {
    position: "relative",
  },
  label: {
    fontSize: 16,
    color: "#8174a0",
    marginBottom: 8,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
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
  },
  dropdownInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholderText: {
    color: "#a99fd6",
    fontSize: 16,
  },
  textSelected: {
    color: "#493d9e",
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#493d9e",
  },
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#493d9e",
  },
  dateDisplay: {
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 56,
  },
  dateText: {
    color: "#493d9e",
    fontSize: 16,
  },
  datePlaceholder: {
    color: "#a99fd6",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "sans-serif",
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: "#22177a",
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "sans-serif-medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
  },
  doneButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  doneButtonText: {
    color: "#493d9e",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#8174a0",
    fontSize: 16,
  },
  loginHighlight: {
    color: "#493d9e",
    fontWeight: "600",
  },
  passwordContainer: {
    position: "relative",
    width: "100%", // ensures the container spans full width
  },
  passwordInput: {
    paddingRight: 40, // extra right padding to leave space for the eye icon
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }], // adjust translateY if needed based on font size
  },
  eyeIcon: {
    fontSize: 18,
    color: "#493d9e",
  },
})