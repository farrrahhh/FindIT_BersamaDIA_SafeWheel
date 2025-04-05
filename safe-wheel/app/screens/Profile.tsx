import React from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { Feather } from "@expo/vector-icons"

export default function Profile() {
  const userData = {
    nama: "Mattheuw Suciadi Wijaya",
    dob: "23–09–2004",
    sex: "Laki-Laki",
    blood: "Mattheuw Suciadi Wijaya",
    phone: "081379630455",
    email: "mattheuwwijaya@gmail.com",
  }

  const renderItem = (label: string, value: string) => (
    <View style={styles.infoBox}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="edit-3" size={20} color="#7B4EF7" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Feather name="user" size={72} color="white" />
          </View>
          <TouchableOpacity style={styles.editAvatar}>
            <Feather name="edit-3" size={16} color="#7B4EF7" />
          </TouchableOpacity>
        </View>

        {renderItem("Nama", userData.nama)}
        {renderItem("Tanggal Lahir", userData.dob)}
        {renderItem("Jenis Kelamin", userData.sex)}
        {renderItem("Golongan Darah", userData.blood)}
        {renderItem("No. Telepon", userData.phone)}
        {renderItem("Email", userData.email)}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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