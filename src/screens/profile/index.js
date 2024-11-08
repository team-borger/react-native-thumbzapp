import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import AddAddressScreen from './AddAddressScreen';
import MyAddressScreen from './MyAddressScreen';
import ProfileScreen from './ProfileScreen';
import OrderFoodInfo from './OrderFoodInfo';
import OrderInfo from './OrderInfo';
import OrdersFoodScreen from './OrdersFoodScreen';
import OrdersScreen from './OrdersScreen';
import LoginScreen from './../LoginScreen';

const Stack = createNativeStackNavigator();

const Profile = ({ logout }) => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ProfileScreen">
          {(props) => <ProfileScreen {...props} logout={logout} />}
        </Stack.Screen>
        <Stack.Screen name="MyAddressScreen" component={MyAddressScreen} />
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
        <Stack.Screen name="OrderFoodInfo" component={OrderFoodInfo} />
        <Stack.Screen name="OrderInfo" component={OrderInfo} />
        <Stack.Screen name="OrdersFoodScreen" component={OrdersFoodScreen} />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default Profile;
