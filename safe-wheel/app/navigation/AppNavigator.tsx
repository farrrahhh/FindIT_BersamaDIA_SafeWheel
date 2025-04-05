
import { createStackNavigator } from '@react-navigation/stack'
import LandingPage from '../screens/LandingPage.tsx';
import SignupScreen from '../screens/SignupScreen.tsx';
import LoginScreen from '@/screens/LoginScreen.tsx';
import RegisterChoices from '@/screens/RegisterChoices.tsx';

// Create stack navigator first
export type RootStackParamList = {
  Landing: undefined;
  Signup: undefined; // Must match the name used in navigation.navigate()
  Login: undefined; // Add Login screen if needed
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
        name="RegisterChoices"
        component={RegisterChoices}
      />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
}