import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.ts"
import kursiroda from "../../assets/images/kursiroda.png"
import perawat from "../../assets/images/perawat.png"
import { Ionicons } from "@expo/vector-icons"

export default function RegisterChoices() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.backgroundBase} />
        <Image
          source={{
            uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ellipse%201-EM2yPl1ZNPz6MpoMyLUCP3QRxXs9Jx.png",
          }}
          style={styles.backgroundEllipse}
        />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Landing")}>
          <Ionicons name="arrow-back" size={28} color="#493d9e" />
        </TouchableOpacity>

        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.title}>Who Are{"\n"}You?</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate("Signup")}
              accessibilityLabel="Pilih Pengguna Kursi Roda"
            >
              <View style={styles.optionImageWrapper}>
                <Image source={kursiroda} style={styles.optionImage} />
              </View>
              <Text style={styles.optionText}>Wheelchair User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate("SignupGuardian")}
              accessibilityLabel="Pilih Keluarga / Perawat"
            >
              <View style={styles.optionImageWrapper}>
                <Image source={perawat} style={styles.optionImage} />
              </View>
              <Text style={styles.optionText}>Family / Guardian</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    marginTop: 30,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    color: "#493d9e",
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    marginBottom: 60,
  },
  optionsContainer: {
    gap: 40,
  },
  optionCard: {
    alignItems: "center",
  },
  optionImageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    backgroundColor: "#bca7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "sans-serif-medium",
  },
})