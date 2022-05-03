import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
  ChatScreen,
  ProfileScreen,
  AddCardScreen,
  PaymentMethodList,
} from './screens';

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    Dashboard,
    ChatScreen,
    ProfileScreen,
    AddCardScreen,
    PaymentMethodList,
  },
  {
    initialRouteName: 'PaymentMethodList',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
