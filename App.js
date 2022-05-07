import React from 'react';
import { Provider } from 'react-native-paper';
import App from './src';
import { theme } from './src/core/theme';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  // HomeScreen,
  // RegisterScreen,
  // ForgotPasswordScreen,
  // Dashboard,
  // ChatScreen,
  // ProfileScreen,
  // AddCardScreen,
  // PaymentMethodList,
} from './src/screens';


// <Provider theme={theme}>
//   <App />
// </Provider>

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.LoginScreen name="LoginScreen" component={LoginScreen} option={{title: 'LoginScreen!!'}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};
// <Stack.HomeScreen name="HomeScreen" component={HomeScreen} option={{title: 'HomeScreen!!'}} />
// <Stack.RegisterScreen name="RegisterScreen" component={RegisterScreen} option={{title: 'RegisterScreen!!'}} />
// <Stack.ForgotPasswordScreen name="ForgotPasswordScreen" component={ForgotPasswordScreen} option={{title: 'ForgotPasswordScreen!!'}} />
// <Stack.Dashboard name="Dashboard" component={Dashboard} option={{title: 'Dashboard!!'}} />
// <Stack.ChatScreen name="ChatScreen" component={ChatScreen} option={{title: 'ChatScreen!!'}} />
// <Stack.ProfileScreen name="ProfileScreen" component={ProfileScreen} option={{title: 'ProfileScreen!!'}} />
// <Stack.AddCardScreen name="AddCardScreen" component={AddCardScreen} option={{title: 'AddCardScreen!!'}} />
// <Stack.PaymentMethodList name="PaymentMethodList" component={PaymentMethodList} option={{title: 'PaymentMethodList!!'}} />


export default Main;
