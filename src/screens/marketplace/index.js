import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import ShoppingScreen from './ShoppingScreen';
import FoodScreen from './FoodScreen';
import ProductInfoScreen from './ProductInfoScreen';
import CartFoodScreen from './CartFoodScreen';

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
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ShoppingScreen" component={ShoppingScreen} />
        <Stack.Screen name="ProductInfoScreen" component={ProductInfoScreen} />
        <Stack.Screen name="FoodScreen" component={FoodScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CartFoodScreen" component={CartFoodScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Marketplace;
