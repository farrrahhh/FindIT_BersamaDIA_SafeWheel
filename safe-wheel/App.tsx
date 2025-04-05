// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import UserLocationScreen from './app/screens/UserLocationScreen';
import Homepage from './app/screens/Homepage';
export default function App() { // Must be default export
  return (
    // <NavigationContainer>
    //   <AppNavigator />
    // </NavigationContainer>
    <Homepage />
  );
}