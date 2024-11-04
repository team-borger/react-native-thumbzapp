import DashboardCard from '../components/DashboardCard';
import { Card } from 'react-native-paper';

export default function Main({ navigation }) {
  const handleCardPress = (route) => {
    console.log('DashboardCard was clicked!');
    navigation.navigate(route)
  };
  return (
    <Card>
      <DashboardCard onPress={() => handleCardPress('Marketplace')}/>
      <DashboardCard onPress={() => handleCardPress('Load')}/>
      <DashboardCard onPress={() => handleCardPress('Ticketing')}/>
      <DashboardCard onPress={() => handleCardPress('Profile')}/>
      <DashboardCard onPress={() => handleCardPress('Dashboard')}/>
    </Card>
  );
}
