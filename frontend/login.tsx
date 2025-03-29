// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingPage() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer} accessibilityRole="header">
        <Text style={styles.headerText}>SafeWheel</Text>
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hi, I'm Alexa</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]}
          accessibilityLabel="Login"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.signupButton]}
          accessibilityLabel="Sign Up"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A4D69',
    fontFamily: 'sans-serif',
    letterSpacing: 1.5,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 24,
    color: '#4B86B4',
    fontWeight: '500',
    fontFamily: 'sans-serif-medium',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 40,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60, // Accessible touch target
  },
  loginButton: {
    backgroundColor: '#4B86B4',
  },
  signupButton: {
    backgroundColor: '#63B4B8',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
});