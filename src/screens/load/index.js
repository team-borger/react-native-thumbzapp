import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import LoadCheckoutScreen from './LoadCheckoutScreen';
import LoadPayedScreen from './LoadPayedScreen';
import LoadProcessScreen from './LoadProcessScreen';
import NetLoadScreen from './NetLoadScreen';
import PaymentOptionLoad from './PaymentOptionLoad';
import AddPaymentScreen from './AddPaymentScreen';
import PaymentMethodList from './PaymentMethodList';
import AddCardListScreen from './AddCardListScreen';
import AddCardScreen from './AddCardScreen';

const Stack = createNativeStackNavigator();

const Load = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="NetLoadScreen" component={NetLoadScreen} />
        <Stack.Screen name="LoadProcessScreen" component={LoadProcessScreen} />
        <Stack.Screen name="LoadPayedScreen" component={LoadPayedScreen} />
        <Stack.Screen name="PaymentOptionLoad" component={PaymentOptionLoad} />
        <Stack.Screen name="AddPaymentScreen" component={AddPaymentScreen} />
        <Stack.Screen name="PaymentMethodList" component={PaymentMethodList} />
        <Stack.Screen name="LoadCheckoutScreen" component={LoadCheckoutScreen} />
        <Stack.Screen name="AddCardListScreen" component={AddCardListScreen} />
        <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default Load;
