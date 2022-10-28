import * as React from 'react';
import { StatusBar } from 'react-native'
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
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import PaymentOptions from './screens/PaymentOptions'
import CallingScreen from './screens/CallingScreen'
import IncomingCallScreen from './screens/IncomingCallScreen'
import AddPaymentScreen from './screens/AddPaymentScreen'
import PaymentSuccessScreen from './screens/PaymentSuccessScreen'
import ProductInfoScreen from './screens/ProductInfoScreen'
import ShoppingScreen from './screens/ShoppingScreen'
import FoodScreen from './screens/FoodScreen'
import NetLoadScreen from './screens/NetLoadScreen'
import FoodMerchantInfoScreen from './screens/FoodMerchantInfoScreen'
import CartFoodScreen from './screens/CartFoodScreen'
import FoodInfoScreen from './screens/FoodInfoScreen'
import CheckoutFoodScreen from './screens/CheckoutFoodScreen'
import LoadProcessScreen from './screens/LoadProcessScreen'
import LoadCheckoutScreen from './screens/LoadCheckoutScreen'
import LoadPayedScreen from './screens/LoadPayedScreen'
import PaymentSuccessFoodScreen from './screens/PaymentSuccessFoodScreen'


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden = {false} backgroundColor = "#64009D" translucent = {true}/>
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
          <Stack.Screen name="CartScreen" component={CartScreen} option={{title: 'CartScreen!!'}} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} option={{title: 'CheckoutScreen!!'}} />
          <Stack.Screen name="PaymentOptions" component={PaymentOptions} option={{title: 'PaymentOptions!!'}} />
          <Stack.Screen name="CallingScreen" component={CallingScreen} option={{title: 'CallingScreen!!'}} />
          <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} option={{title: 'IncomingCallScreen!!'}} />
          <Stack.Screen name="AddPaymentScreen" component={AddPaymentScreen} option={{title: 'AddPaymentScreen!!'}} />
          <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} option={{title: 'PaymentSuccessScreen!!'}} />
          <Stack.Screen name="ProductInfoScreen" component={ProductInfoScreen} option={{title: 'ProductInfoScreen!!'}} />
          <Stack.Screen name="ShoppingScreen" component={ShoppingScreen} option={{title: 'ShoppingScreen!!'}} />
          <Stack.Screen name="FoodScreen" component={FoodScreen} option={{title: 'FoodScreen!!'}} />
          <Stack.Screen name="NetLoadScreen" component={NetLoadScreen} option={{title: 'NetLoadScreen!!'}} />
          <Stack.Screen name="FoodMerchantInfoScreen" component={FoodMerchantInfoScreen} option={{title: 'FoodMerchantInfoScreen!!'}} />
          <Stack.Screen name="CartFoodScreen" component={CartFoodScreen} option={{title: 'CartFoodScreen!!'}} />
          <Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen} option={{title: 'FoodInfoScreen!!'}} />
          <Stack.Screen name="CheckoutFoodScreen" component={CheckoutFoodScreen} option={{title: 'CheckoutFoodScreen!!'}} />
          <Stack.Screen name="LoadProcessScreen" component={LoadProcessScreen} option={{title: 'LoadProcessScreen!!'}} />
          <Stack.Screen name="LoadCheckoutScreen" component={LoadCheckoutScreen} option={{title: 'LoadCheckoutScreen!!'}} />
          <Stack.Screen name="LoadPayedScreen" component={LoadPayedScreen} option={{title: 'LoadPayedScreen!!'}} />
          <Stack.Screen name="PaymentSuccessFoodScreen" component={PaymentSuccessFoodScreen} option={{title: 'PaymentSuccessFoodScreen!!'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
