import * as React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { navigationRef } from './components/RootNavigation';

import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// NEW SCREENS
import Marketplace from './screens/marketplace';
import Load from './screens/load';
import Ticketing from './screens/ticketing';
import Profile from './screens/profile';

// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/marketplace/HomeScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import Dashboard from './screens/Dashboard';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from './screens';
// import ChatScreen from './screens/ChatScreen';
// import CallScreen from './screens/CallScreen';
// import ProfileScreen from './screens/profile/ProfileScreen';
// import AddCardScreen from './screens/AddCardScreen';
// import AddCardListScreen from './screens/AddCardListScreen';
// import PaymentMethodList from './screens/PaymentMethodList';
// import SearchContactScreen from './screens/SearchContactScreen';
// import CartScreen from './screens/marketplace/CartScreen';
// import CheckoutScreen from './screens/CheckoutScreen';
// import PaymentOptions from './screens/PaymentOptions';
// import CallingScreen from './screens/CallingScreen';
// import IncomingCallScreen from './screens/IncomingCallScreen';
// import AddPaymentScreen from './screens/AddPaymentScreen';
// import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
// import ProductInfoScreen from './screens/marketplace/ProductInfoScreen';
// import ShoppingScreen from './screens/marketplace/ShoppingScreen';
// import FoodScreen from './screens/marketplace/FoodScreen';
// import NetLoadScreen from './screens/load/NetLoadScreen';
// import FoodMerchantInfoScreen from './screens/FoodMerchantInfoScreen';
// import CartFoodScreen from './screens/marketplace/CartFoodScreen';
// import FoodInfoScreen from './screens/FoodInfoScreen';
// import CheckoutFoodScreen from './screens/CheckoutFoodScreen';
// import LoadProcessScreen from './screens/load/LoadProcessScreen';
// import LoadCheckoutScreen from './screens/load/LoadCheckoutScreen';
// import LoadPayedScreen from './screens/load/LoadPayedScreen';
// import PaymentSuccessFoodScreen from './screens/PaymentSuccessFoodScreen';
// import MyAddressScreen from './screens/MyAddressScreen';
// import AddAddressScreen from './screens/AddAddressScreen';
// import MyAddressCheckout from './screens/MyAddressCheckout';
// import AddAddressCheckout from './screens/AddAddressCheckout';
// import OrdersScreen from './screens/OrdersScreen';
// import PaymentOptionLoad from './screens/PaymentOptionLoad';
// import VerifyEmailScreen from './screens/VerifyEmailScreen';
// import ForgotPassEmail from './screens/ForgotPassEmail';
// import BookScreen from './screens/booking/BookScreen';
// import BookSuccess from './screens/BookSuccess';
// import XenditInvoice from './screens/xenditGateway/Invoice';
// import OrderInfo from './screens/OrderInfo';
// import OrdersFoodScreen from './screens/OrdersFoodScreen';
// import OrderFoodInfo from './screens/OrderFoodInfo';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const OverallRoutes = () => {
  return (
    <SafeAreaProvider>
      {/* <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} /> */}
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
          <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
          <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
          <Stack.Screen name='AuthenticatedRoutes' component={AuthenticatedRoutes} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const AuthenticatedRoutes = () => {
  const navigationRef = React.useRef();

  const handleTabPress = routeName => {
    const initialRouteMap = {
      Marketplace: 'HomeScreen',
      Load: 'NetLoadScreen',
      Ticketing: 'BookScreen',
      Profile: 'ProfileScreen',
      Dashboard: 'Dashboard',
    };
    navigationRef.current.navigate(routeName, {
      screen: initialRouteMap[routeName],
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      <NavigationContainer ref={navigationRef} independent={true}>
        {/* <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="AddAddressCheckout" component={AddAddressCheckout} option={{title: 'AddAddressCheckout!!'}} />
          <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} option={{title: 'AddAddressScreen!!'}} />
          <Stack.Screen name="AddCardListScreen" component={AddCardListScreen} option={{title: 'AddCardListScreen!!'}} />
          <Stack.Screen name="AddCardScreen" component={AddCardScreen} option={{title: 'AddCardScreen!!'}} />
          <Stack.Screen name="AddPaymentScreen" component={AddPaymentScreen} option={{title: 'AddPaymentScreen!!'}} />
          <Stack.Screen name="BookScreen" component={BookScreen} option={{title: 'BookScreen!!'}} />
          <Stack.Screen name="BookSuccess" component={BookSuccess} option={{title: 'BookSuccess!!'}} />
          <Stack.Screen name="CallingScreen" component={CallingScreen} option={{title: 'CallingScreen!!'}} />
          <Stack.Screen name="CallScreen" component={CallScreen} option={{title: 'CallScreen!!'}} />
          <Stack.Screen name="CartFoodScreen" component={CartFoodScreen} option={{title: 'CartFoodScreen!!'}} />
          <Stack.Screen name="CartScreen" component={CartScreen} option={{title: 'CartScreen!!'}} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} option={{title: 'ChatScreen!!'}} />
          <Stack.Screen name="CheckoutFoodScreen" component={CheckoutFoodScreen} option={{title: 'CheckoutFoodScreen!!'}} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} option={{title: 'CheckoutScreen!!'}} />
          <Stack.Screen name="Dashboard" component={Dashboard} option={{title: 'Dashboard!!'}} />
          <Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen} option={{title: 'FoodInfoScreen!!'}} />
          <Stack.Screen name="FoodMerchantInfoScreen" component={FoodMerchantInfoScreen} option={{title: 'FoodMerchantInfoScreen!!'}} />
          <Stack.Screen name="FoodScreen" component={FoodScreen} option={{title: 'FoodScreen!!'}} />
          <Stack.Screen name="ForgotPassEmail" component={ForgotPassEmail} option={{title: 'ForgotPassEmail!!'}} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} option={{title: 'ForgotPasswordScreen!!'}} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} option={{title: 'HomeScreen!!'}} />
          <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} option={{title: 'IncomingCallScreen!!'}} />
          <Stack.Screen name="LoadCheckoutScreen" component={LoadCheckoutScreen} option={{title: 'LoadCheckoutScreen!!'}} />
          <Stack.Screen name="LoadPayedScreen" component={LoadPayedScreen} option={{title: 'LoadPayedScreen!!'}} />
          <Stack.Screen name="LoadProcessScreen" component={LoadProcessScreen} option={{title: 'LoadProcessScreen!!'}} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} option={{title: 'LoginScreen!!'}} />
          <Stack.Screen name="MyAddressCheckout" component={MyAddressCheckout} option={{title: 'MyAddressCheckout!!'}} />
          <Stack.Screen name="MyAddressScreen" component={MyAddressScreen} option={{title: 'MyAddressScreen!!'}} />
          <Stack.Screen name="NetLoadScreen" component={NetLoadScreen} option={{title: 'NetLoadScreen!!'}} />
          <Stack.Screen name="OrderFoodInfo" component={OrderFoodInfo} option={{title: 'OrderFoodInfo!!'}} />
          <Stack.Screen name="OrderInfo" component={OrderInfo} option={{title: 'OrderInfo!!'}} />
          <Stack.Screen name="OrdersFoodScreen" component={OrdersFoodScreen} option={{title: 'OrdersFoodScreen!!'}} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} option={{title: 'OrdersScreen!!'}} />
          <Stack.Screen name="PaymentMethodList" component={PaymentMethodList} option={{title: 'PaymentMethodList!!'}} />
          <Stack.Screen name="PaymentOptionLoad" component={PaymentOptionLoad} option={{title: 'PaymentOptionLoad!!'}} />
          <Stack.Screen name="PaymentOptions" component={PaymentOptions} option={{title: 'PaymentOptions!!'}} />
          <Stack.Screen name="PaymentSuccessFoodScreen" component={PaymentSuccessFoodScreen} option={{title: 'PaymentSuccessFoodScreen!!'}} />
          <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} option={{title: 'PaymentSuccessScreen!!'}} />
          <Stack.Screen name="ProductInfoScreen" component={ProductInfoScreen} option={{title: 'ProductInfoScreen!!'}} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} option={{title: 'ProfileScreen!!'}} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} option={{title: 'RegisterScreen!!'}} />
          <Stack.Screen name="SearchContactScreen" component={SearchContactScreen} option={{title: 'SearchContactScreen!!'}} />
          <Stack.Screen name="ShoppingScreen" component={ShoppingScreen} option={{title: 'ShoppingScreen!!'}} />
          <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} option={{title: 'VerifyEmailScreen!!'}} />
          <Stack.Screen name="XenditInvoice" component={XenditInvoice} option={{title: 'XenditInvoice!!'}} />
        </Stack.Navigator> */}
        <Tab.Navigator
          initialRouteName="Marketplace"
          options={{
            tabBarShowLabel: 'false',
          }}
          screenOptions={({ route }) => ({
            headerShown: false, // Hide header for tab screens
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={() => handleTabPress(route.name)}
              />
            ),
          })}
          // tabBarOptions={{
          //   headerShown: false,
          //   activeTintColor: 'blue', // Change this to your desired active label color
          //   inactiveTintColor: 'gray', // Change this to your desired inactive label color
          // }}
        >
          <Tab.Screen
            name="Marketplace"
            component={Marketplace}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <FontAwesome
                      name="shopping-cart"
                      size={24}
                      color={focused ? '#fff' : '#111'}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <FontAwesome
                      name="comment"
                      size={24}
                      color={focused ? '#fff' : '#111'}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Load"
            component={Load}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <FontAwesome
                      name="mobile-phone"
                      size={24}
                      color={focused ? '#fff' : '#111'}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Ticketing"
            component={Ticketing}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <Ionicons
                      name="airplane"
                      size={24}
                      color={focused ? '#fff' : '#111'}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <Ionicons
                      name="settings"
                      size={24}
                      color={focused ? '#fff' : '#111'}
                    />
                  </View>
                );
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// export default AuthenticatedRoutes;
export default OverallRoutes;

const styles = StyleSheet.create({
  activeTab: {
    alignItems: 'center',
    color: '#880ED4',
    justifyContent: 'center',
    backgroundColor: '#880ED4',
    width: Platform.OS == 'ios' ? 40 : 50,
    height: Platform.OS == 'ios' ? 40 : 50,
    top: Platform.OS == 'ios' ? -50 : -15,
    borderRadius: Platform.OS == 'ios' ? 25 : 30,
  },
  inactiveTab: { alignItems: 'center', justifyContent: 'center' },
});
