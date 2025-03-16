import './global.css';
import { Text, View } from 'react-native';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <View className="flex h-full items-center justify-center">
      <LandingPage />
    </View>
  );
}
