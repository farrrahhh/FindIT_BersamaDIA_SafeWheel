// app/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

interface FormData {
  email: string;
  password: string;
  username: string;
  sex: string;
  dob: string;
  bloodType: string;
  emergencyNumber: string;
}

interface Props {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
    sex: '',
    dob: '',
    bloodType: '',
    emergencyNumber: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.email.includes('@')) newErrors.push('email');
    if (formData.password.length < 8) newErrors.push('password');
    if (formData.username.length < 3) newErrors.push('username');
    if (!formData.sex) newErrors.push('sex');
    if (!formData.dob) newErrors.push('dob');
    if (!formData.bloodType) newErrors.push('bloodType');
    if (formData.emergencyNumber.length < 10) newErrors.push('emergencyNumber');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigation.goBack();
    }
  };

  const renderInputField = (
    label: string,
    field: keyof FormData,
    keyboardType?: KeyboardTypeOptions,
    secure?: boolean
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, errors.includes(field) && styles.inputError]}
          value={formData[field]}
          onChangeText={(text) => setFormData({...formData, [field]: text})}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize="none"
          accessibilityLabel={label}
        />
        {errors.includes(field) && (
          <Text style={styles.errorText}>Please enter a valid {label.toLowerCase()}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Create Account</Text>

        <View style={styles.formContainer}>
          {renderInputField('Email', 'email', 'email-address')}
          {renderInputField('Password', 'password', undefined, true)}
          {renderInputField('Username', 'username')}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sex</Text>
            <Picker
              selectedValue={formData.sex}
              onValueChange={(value: string) => setFormData({...formData, sex: value})}
              style={[styles.input, errors.includes('sex') && styles.inputError]}
              accessibilityLabel="Select sex"
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          {renderInputField('Date of Birth (YYYY-MM-DD)', 'dob')}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Type</Text>
            <Picker
              selectedValue={formData.bloodType}
              onValueChange={(value: string) => setFormData({...formData, bloodType: value})}
              style={[styles.input, errors.includes('bloodType') && styles.inputError]}
              accessibilityLabel="Select blood type"
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
            </Picker>
          </View>

          {renderInputField('Emergency Number', 'emergencyNumber', 'phone-pad')}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          accessibilityLabel="Create Account"
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
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
    color: '#493d9e',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#493d9e',
    marginVertical: 30,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#8174a0',
    marginBottom: 8,
    fontFamily: 'sans-serif-medium',
  },
  input: {
    backgroundColor: '#f5f3ff',
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: '#493d9e',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: '#493d9e',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
});