import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

const Marketplace = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={false} backgroundColor="#64009D" translucent={true} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      ></Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default Marketplace;
