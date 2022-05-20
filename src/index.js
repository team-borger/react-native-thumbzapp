import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './components/RootNavigation';

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import Dashboard from './screens/Dashboard'
import ChatScreen from './screens/ChatScreen'
import CallScreen from './screens/CallScreen'
import ProfileScreen from './screens/ProfileScreen'
import AddCardScreen from './screens/AddCardScreen'
import PaymentMethodList from './screens/PaymentMethodList'
import SearchContactScreen from './screens/SearchContactScreen'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} option={{title: 'LoginScreen!!'}} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} option={{title: 'HomeScreen!!'}} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} option={{title: 'RegisterScreen!!'}} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} option={{title: 'ForgotPasswordScreen!!'}} />
          <Stack.Screen name="Dashboard" component={Dashboard} option={{title: 'Dashboard!!'}} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} option={{title: 'ChatScreen!!'}} />
          <Stack.Screen name="CallScreen" component={CallScreen} option={{title: 'CallScreen!!'}} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} option={{title: 'ProfileScreen!!'}} />
          <Stack.Screen name="AddCardScreen" component={AddCardScreen} option={{title: 'AddCardScreen!!'}} />
          <Stack.Screen name="PaymentMethodList" component={PaymentMethodList} option={{title: 'PaymentMethodList!!'}} />
          <Stack.Screen name="SearchContactScreen" component={SearchContactScreen} option={{title: 'SearchContactScreen!!'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
