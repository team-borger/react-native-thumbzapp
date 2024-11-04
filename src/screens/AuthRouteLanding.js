import React from 'react';
import { ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import DashboardCard from '../components/DashboardCard';

export default function Main({ navigation }) {
  const handleCardPress = (route) => {
    console.log('DashboardCard was clicked!');
    navigation.navigate(route);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
      <Card>
        <DashboardCard onPress={() => handleCardPress('Marketplace')} />
        <DashboardCard onPress={() => handleCardPress('Load')} />
        <DashboardCard onPress={() => handleCardPress('Ticketing')} />
        <DashboardCard onPress={() => handleCardPress('Profile')} />
        <DashboardCard onPress={() => handleCardPress('Dashboard')} />
      </Card>
    </ScrollView>
  );
}
