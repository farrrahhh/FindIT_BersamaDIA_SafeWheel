import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.tsx"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export default function Profile() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [userData, setUserData] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [fieldToEdit, setFieldToEdit] = useState<string>("")
  const [newValue, setNewValue] = useState("")

  const isFieldEditable = (fieldKey: string) => {
    const uneditableFields = ["dob", "user_email", "guardian_email"]
    return !uneditableFields.includes(fieldKey)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem("user_email")
      const storedRole = await AsyncStorage.getItem("user_role")
      setRole(storedRole)

      if (!email || !storedRole) return

      try {
        const response = await axios.get("https://find-it-bersama-dia-safe-wheel.vercel.app/api/user", {
          params: { email, role: storedRole },
        })

        if (response.status === 200) {
          setUserData(response.data.user)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }

    fetchUserData()
  }, [])

  const handleEdit = (field: string, currentValue: string) => {
    setFieldToEdit(field)
    if (field === "password") {
      setNewValue("")
    } else {
      setNewValue(currentValue)
    }
    setModalVisible(true)
  }

  const handleSave = async () => {
    try {
      const email = await AsyncStorage.getItem("user_email")
      const storedRole = await AsyncStorage.getItem("user_role")

      const updates =
        fieldToEdit === "password"
          ? storedRole === "guardian"
            ? { guardian_password: newValue }
            : { user_password: newValue }
          : { [fieldToEdit]: newValue }

      await axios.put("https://find-it-bersama-dia-safe-wheel.vercel.app/api/user", {
        email,
        role: storedRole,
        updates,
      })

      if (fieldToEdit !== "password") {
        setUserData((prev: any) => ({
          ...prev,
          [fieldToEdit]: newValue,
        }))
      }

      setModalVisible(false)
    } catch (error) {
      Alert.alert("Error", "Gagal memperbarui data")
    }
  }

  const renderItem = (label: string, value: string | undefined, fieldKey: string) => (
    <View style={styles.infoBox}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "-"}</Text>
      </View>
      {isFieldEditable(fieldKey) && (
        <TouchableOpacity onPress={() => handleEdit(fieldKey, value || "")}> 
          <Feather name="edit-3" size={20} color="#7B4EF7" />
        </TouchableOpacity>
      )}
    </View>
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color="#7B4EF7" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Feather name="user" size={72} color="white" />
          </View>
        </View>

        {role === "wheelchair" && userData && (
          <>
            {renderItem("Name", userData.user_name, "user_name")}
            {renderItem("Date of Birth", formatDate(userData.dob), "dob")}
            {renderItem("Gender", userData.sex, "sex")}
            {renderItem("Blood Type", userData.bloodtype, "bloodtype")}
            {renderItem("Phone", userData.emergency_number, "emergency_number")}
            {renderItem("Email", userData.user_email, "user_email")}
            {renderItem("Change Password", "********", "password")}
          </>
        )}

        {role === "guardian" && userData && (
          <>
            {renderItem("Name", userData.guardian_name, "guardian_name")}
            {renderItem("Email", userData.guardian_email, "guardian_email")}
            {renderItem("Change Password", "********", "password")}
          </>
        )}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.multiRemove([
              "token",
              "email",
              "safewheel_id",
              "user_name",
              "role",
              // tambahkan apa pun yang kamu simpan saat login
            ]);
            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit {fieldToEdit}</Text>
            <TextInput
              style={styles.input}
              value={newValue}
              onChangeText={setNewValue}
              placeholder="Masukkan nilai baru"
              secureTextEntry={fieldToEdit === "password"}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={{ color: "#7B4EF7" }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={{ color: "white" }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    marginTop: 20,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  avatarWrapper: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    backgroundColor: "#7B4EF7",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#7B4EF7",
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#7B4EF7",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: "#000",
    fontSize: 16,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#7B4EF7",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 12,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#7B4EF7",
    padding: 10,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 40,
    padding: 12,
    backgroundColor: "#FF5A5F",
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})