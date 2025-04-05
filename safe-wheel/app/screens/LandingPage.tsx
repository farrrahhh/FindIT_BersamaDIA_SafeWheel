import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';


export default function LandingPage() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Background with multiple layers */}
        <View style={styles.backgroundBase} />

        {/* Background Ellipse */}
        <Image
          source={{
            uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ellipse%201-EM2yPl1ZNPz6MpoMyLUCP3QRxXs9Jx.png",
          }}
          style={styles.backgroundEllipse}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header Section */}
          <View style={styles.headerContainer} accessibilityRole="header">
            <Text style={styles.headerText}>Safe</Text>
            <Text style={styles.headerText}>Wheel</Text>
          </View>

          {/* Wheelchair Image */}
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wheel%20chair-ZGGu2gOActkooNaEedtGGyv6vm2wMg.png",
            }}
            style={styles.wheelchairImage}
            accessibilityLabel="Purple wheelchair illustration"
          />

          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hi, I'm Alexa <Text style={styles.emojiText}>😺</Text>
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('Login')}
              accessibilityLabel="Login"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Update Sign Up button */}
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => navigation.navigate('RegisterChoices')}
              accessibilityLabel="Signup"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Indicator */}
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 120,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#493d9e",
    lineHeight: 70,
    letterSpacing: 0.5,
    fontFamily: "sans-serif",
  },
  wheelchairImage: {
    position: "absolute",
    left: 150,
    bottom: 300,
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  greetingContainer: {
    marginTop: "auto",
    marginBottom: 20,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 32,
    color: "#8174a0",
    fontWeight: "500",
    fontFamily: "sans-serif-medium",
  },
  emojiText: {
    fontSize: 32,
  },
  buttonContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 60, // Accessible touch target
  },
  loginButton: {
    backgroundColor: "#22177a",
  },
  signupButton: {
    backgroundColor: "#493d9e",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "sans-serif-medium",
  },
  bottomIndicator: {
    width: 100,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
})

