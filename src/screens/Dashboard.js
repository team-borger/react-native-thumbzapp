import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { conversationsAPI, updateViewedAPI } from '../services/messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [items, setItems] = useState([])

  const _onChatClick = (item) => {
    AsyncStorage.setItem('active_chat', JSON.stringify(item))
    updateViewedAPI(item.contact.id, clickSuccess, clickError)
  }

  const clickSuccess = () => {
    navigation.replace('ChatScreen')
  }

  const clickError = err => {
    const { error, message } = err.response.data;
    if (error) {
      Alert.alert('Something went wrong. Please try again.', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Something went wrong. Please try again.', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const fetchSuccess = res => {
    setItems(res.data)
  }

  const fetchError = err => {
    const { error, message } = err.response.data;
    if (error) {
      Alert.alert('Something went wrong. Please try again.', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Something went wrong. Please try again.', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      conversationsAPI(fetchSuccess, fetchError);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Messages</Text>} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Searchbar
          placeholder="Search"
        />
        <FlatList
          style={styles.scrollView}
          data={items}
          renderItem={({ item }) => (
            <Card key={item.id} style={{marginBottom: 5}} onPress={() => _onChatClick(item)}>
              <Card.Content style={{paddingHorizontal: 10, paddingVertical: 5}}>
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Avatar.Text style={styles.avatar} size={37} label={item.contact.first_name.charAt(0) + item.contact.last_name.charAt(0)} />
                    <View style={{marginLeft: 10, flex: 1}}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: 'bold'}}>{item.contact.first_name + ' ' + item.contact.last_name}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>{moment(item.date_created).format('hh:mm A')}</Text>
                      </View>
                      <Text style={{color: 'gray', fontSize: 12}}>{item.spoiler_chat}</Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    paddingTop: 0,
    padding: 20,
    height: '100%'
  },
  marginText: {
    marginLeft: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  setColorText: {
    color: '#880ED4'
  },
  header: {
    backgroundColor: 'transparent'
  },
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10
  }
});

export default memo(Dashboard);
