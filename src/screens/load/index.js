import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import LoadCheckoutScreen from './LoadCheckoutScreen';
import LoadPayedScreen from './LoadPayedScreen';
import LoadProcessScreen from './LoadProcessScreen';
import NetLoadScreen from './NetLoadScreen';

const Stack = createNativeStackNavigator();

const Load = () => {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        navigation.popToTop();
      });

      return unsubscribe;
    }, [navigation])
  );
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoadCheckoutScreen" component={LoadCheckoutScreen} />
        <Stack.Screen name="LoadPayedScreen" component={LoadPayedScreen} />
        <Stack.Screen name="LoadProcessScreen" component={LoadProcessScreen} />
        <Stack.Screen name="NetLoadScreen" component={NetLoadScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Load;
