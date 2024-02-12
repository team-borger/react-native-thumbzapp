import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import AddAddressScreen from './AddAddressScreen';
import MyAddressScreen from './MyAddressScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

const Profile = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
        <Stack.Screen name="MyAddressScreen" component={MyAddressScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Profile;
