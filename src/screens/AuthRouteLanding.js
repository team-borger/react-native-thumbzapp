import React from 'react';
import { ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import DashboardCard from '../components/DashboardCard';

export default function Main({ navigation }) {
  const handleCardPress = (route) => {
    navigation.navigate(route);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
      <Card>
        <DashboardCard text={'Marketplace'} onPress={() => handleCardPress('Marketplace')} />
        <DashboardCard text={'Load'} onPress={() => handleCardPress('Load')} />
        <DashboardCard text={'Ticketing'} onPress={() => handleCardPress('Ticketing')} />
        <DashboardCard text={'Profile'} onPress={() => handleCardPress('Profile')} />
        <DashboardCard text={'Messaging'} onPress={() => handleCardPress('Dashboard')} />
      </Card>
    </ScrollView>
  );
}
