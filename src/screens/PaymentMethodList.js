import React, { memo } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';

type Props = {
  navigation: Navigation;
};

const items = [
  {"id":"1","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"2","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"3","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"4","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"5","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"6","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"7","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"8","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"9","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"10","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"11","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"12","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"13","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"14","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"15","account_number":"123456790123456","exp_month": "03","exp_year":"25"},
  {"id":"16","account_number":"123456790123456","exp_month": "03","exp_year":"25"}
];

const ChatScreen = ({ navigation }: Props) => {
  const _goBack = () => {
    navigation.navigate('ProfileScreen');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Manage Methods</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{flex: 1, padding: 20}}>
          <FlatList
            style={styles.scrollView}
            data={items}
            renderItem={({ item }) => (
              <Card style={styles.customCard}>
                <Card.Content>
                  <View style={styles.alignCenterRow}>
                    <View style={styles.alignCenterRow}>
                      <Image source={IMAGE.ICON_MASTERCARD} style={styles.image} />
                      <View>
                        <Text style={{fontWeight: 'bold'}}>{item.account_number}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>Expires {item.exp_month + '/' + item.exp_year}</Text>
                      </View>
                    </View>
                    <FontAwesome name='trash' size={20} color='gray' />
                  </View>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Button icon="plus" style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('AddCardScreen')}>
          Add Card
        </Button>
      </View>

    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  customCard: {
    marginLeft: 0,
    marginRight: 0,
    margin: 5
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: '#eeeeee'
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10
  },
  ground: {
    padding: 20,
    backgroundColor: '#eeeeee',
    height: '100%'
  },
  setColorText : {
    color: '#880ED4'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  header: {
    backgroundColor: 'transparent',
  }
});
