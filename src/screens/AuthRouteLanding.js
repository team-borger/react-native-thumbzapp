import React from 'react';
import { ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import DashboardCard from '../components/DashboardCard';

export default function Main({ navigation }) {
  const handleCardPress = route => {
    navigation.navigate(route);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
      <Card>
        <DashboardCard
          text={'Marketplace'}
          onPress={() => handleCardPress('Marketplace')}
        />
        <DashboardCard
          imageSource={
            'https://lottie.host/embed/6c0c55cd-1028-47ff-bd9e-cf4f488263d8/lgpPLAsEGy.json'
          }
          text={'Load'}
          onPress={() => handleCardPress('Load')}
        />
        <DashboardCard
          imageSource={
            'https://lottie.host/embed/11ff281c-2846-44c7-94f2-df1898b58da2/YQAEbaCoxl.json'
          }
          text={'Ticketing'}
          onPress={() => handleCardPress('Ticketing')}
        />
        <DashboardCard
          imageSource={
            'https://lottie.host/embed/4fa3b9d1-1c14-4de7-ba48-8a16fd7ebbb7/sky16TAWBE.json'
          }
          text={'Profile'}
          onPress={() => handleCardPress('Profile')}
        />
        <DashboardCard
          imageSource={
            'https://lottie.host/embed/b081a8f8-6db7-44b0-9830-719e9406f94a/8Ndhpf7YC3.json'
          }
          text={'Messaging'}
          onPress={() => handleCardPress('Dashboard')}
        />
      </Card>
    </ScrollView>
  );
}
