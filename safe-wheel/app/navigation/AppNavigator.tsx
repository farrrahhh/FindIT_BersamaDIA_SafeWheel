
import { createStackNavigator } from '@react-navigation/stack'
import LandingPage from '../screens/LandingPage.tsx';
import SignupScreen from '../screens/SignupScreen.tsx';
import LoginScreen from '@/screens/LoginScreen.tsx';
import RegisterChoices from '@/screens/RegisterChoices.tsx';
import UserLocationScreen from '@/screens/UserLocationScreen.tsx';
import Alert from '@/screens/Alert.tsx';
import SignupGuardian from '@/screens/SignUpGuardian.tsx';
import Homepage from '@/screens/Homepage.tsx';
import Emergency from '@/screens/Emergency.tsx';
import Profile from '@/screens/Profile.tsx';
import HistoryNotification from '@/screens/HistoryNotification.tsx';
export type RootStackParamList = {
  Landing: undefined;
  Signup: undefined; 
  Login: undefined;
  SignupGuardian: undefined;
  RegisterChoices: undefined;
  UserLocation: undefined;
  Alert: undefined;
  Homepage: undefined;
  Emergency: undefined;
  Profile: undefined;
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
        name='SignupGuardian'
        component={SignupGuardian}
      />
      
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Alert"
        component={Alert}
      />
      <Stack.Screen
        name="UserLocation"
        component={UserLocationScreen}
      />
      <Stack.Screen
        name="Homepage"
        component={Homepage}
      />
      <Stack.Screen
        name="Emergency"
        component={Emergency}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        name="HistoryNotification"
        component={HistoryNotification}
      />
      

    </Stack.Navigator>
  );
}