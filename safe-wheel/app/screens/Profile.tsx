import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.tsx"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

type UserWheelchair = {
  user_email: string
  user_name: string
  dob: string
  sex: string
  bloodtype: string
  emergency_number: string
}

type UserGuardian = {
  guardian_email: string
  guardian_name: string
}

export default function Profile() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [userData, setUserData] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

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

  const renderItem = (label: string, value: string | undefined) => (
    <View style={styles.infoBox}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "-"}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="edit-3" size={20} color="#7B4EF7" />
      </TouchableOpacity>
    </View>
  )

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
          <TouchableOpacity style={styles.editAvatar}>
            <Feather name="edit-3" size={16} color="#7B4EF7" />
          </TouchableOpacity>
        </View>

        {role === "wheelchair" && userData && (
          <>
            {renderItem("Nama", userData.user_name)}
            {renderItem("Tanggal Lahir", userData.dob)}
            {renderItem("Jenis Kelamin", userData.sex)}
            {renderItem("Golongan Darah", userData.bloodtype)}
            {renderItem("No. Telepon", userData.emergency_number)}
            {renderItem("Email", userData.user_email)}
          </>
        )}

        {role === "guardian" && userData && (
          <>
            {renderItem("Nama", userData.guardian_name)}
            {renderItem("Email", userData.guardian_email)}
          </>
        )}
      </ScrollView>
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
  editAvatar: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderColor: "#7B4EF7",
    borderWidth: 2,
    borderRadius: 16,
    padding: 6,
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
})