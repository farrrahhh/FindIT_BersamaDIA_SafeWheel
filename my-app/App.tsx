import './global.css';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';


export default function App() {
  return (
    <View className="flex h-full items-center justify-center">
      <LandingPage />
    </View>
  );
}
