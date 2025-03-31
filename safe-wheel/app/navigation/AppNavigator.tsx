// app/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
// app/navigation/AppNavigator.tsx
import LandingPage from '../screens/LandingPage'; // Updated path
import SignupScreen from '../screens/SignupScreen';

// Create stack navigator first
export type RootStackParamList = {
  Landing: undefined;
  Signup: undefined; // Must match the name used in navigation.navigate()
};

const Stack = createStackNavigator<RootStackParamList>();

// Default export required
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingPage}
      />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}