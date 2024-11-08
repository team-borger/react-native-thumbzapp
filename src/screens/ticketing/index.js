import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import BookScreen from './BookScreen';
import BookSuccess from './BookSuccess';

const Stack = createNativeStackNavigator();

const Ticketing = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="BookScreen" component={BookScreen} />
        <Stack.Screen name="BookSuccess" component={BookSuccess} />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default Ticketing;
