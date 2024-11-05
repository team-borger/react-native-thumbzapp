import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import Dashboard from './Dashboard';
import SearchContactScreen from './SearchContactScreen';
import ChatScreen from './ChatScreen';
import CallingScreen from './CallingScreen';
import CallScreen from './CallScreen';
import IncomingCallScreen from './IncomingCallScreen';

const Stack = createNativeStackNavigator();

const Marketplace = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="SearchContactScreen" component={SearchContactScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="CallingScreen" component={CallingScreen} />
        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Marketplace;
