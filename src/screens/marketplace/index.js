import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import ShoppingScreen from './ShoppingScreen';
import ProductInfoScreen from './ProductInfoScreen';
import FoodScreen from './FoodScreen';
import FoodMerchantInfoScreen from './FoodMerchantInfoScreen';
import FoodInfoScreen from './FoodInfoScreen';
import CartFoodScreen from './CartFoodScreen';
import CheckoutFoodScreen from './CheckoutFoodScreen';
import CheckoutScreen from './CheckoutScreen';
import MyAddressCheckout from './MyAddressCheckout';
import AddAddressCheckout from './AddAddressCheckout';
import PaymentSuccessScreen from './PaymentSuccessScreen';
import PaymentSuccessFoodScreen from './PaymentSuccessFoodScreen';
import PaymentOptions from './PaymentOptions';
import XenditInvoice from './Invoice';

const Stack = createNativeStackNavigator();

const Marketplace = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ShoppingScreen" component={ShoppingScreen} />
        <Stack.Screen name="ProductInfoScreen" component={ProductInfoScreen} />
        <Stack.Screen name="FoodScreen" component={FoodScreen} />
        <Stack.Screen name="FoodMerchantInfoScreen" component={FoodMerchantInfoScreen} />
        <Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CartFoodScreen" component={CartFoodScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="CheckoutFoodScreen" component={CheckoutFoodScreen} />
        <Stack.Screen name="MyAddressCheckout" component={MyAddressCheckout} />
        <Stack.Screen name="AddAddressCheckout" component={AddAddressCheckout} />
        <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
        <Stack.Screen name="PaymentSuccessFoodScreen" component={PaymentSuccessFoodScreen} />
        <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
        <Stack.Screen name="XenditInvoice" component={XenditInvoice} />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default Marketplace;
