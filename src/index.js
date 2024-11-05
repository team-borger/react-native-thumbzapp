import React, { useState } from 'react';
import DashboardCard from './components/DashboardCard';
import { StatusBar, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// NEW SCREENS
import Marketplace from './screens/marketplace';
import Load from './screens/load';
import Ticketing from './screens/ticketing';
import Profile from './screens/profile';
import Dashboard from './screens/messaging';
import AuthRouteLanding from './screens/AuthRouteLanding'; // Import the new component
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from './screens';

const Stack = createNativeStackNavigator();

const AuthenticatedRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AuthRouteLanding" component={AuthRouteLanding} />
      <Stack.Screen name="Marketplace" component={Marketplace} />
      <Stack.Screen name="Load" component={Load} />
      <Stack.Screen name="Ticketing" component={Ticketing} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

const OverallRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder auth state

  return (
    <SafeAreaProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="AuthenticatedRoutes" component={AuthenticatedRoutes} />
          ) : (
            <>
              <Stack.Screen name="LoginScreen">
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default OverallRoutes;

const styles = StyleSheet.create({
  activeTab: {
    alignItems: 'center',
    color: '#880ED4',
    justifyContent: 'center',
    backgroundColor: '#880ED4',
    width: Platform.OS === 'ios' ? 40 : 50,
    height: Platform.OS === 'ios' ? 40 : 50,
    top: Platform.OS === 'ios' ? -50 : -15,
    borderRadius: Platform.OS === 'ios' ? 25 : 30,
  },
  inactiveTab: { alignItems: 'center', justifyContent: 'center' },
});
