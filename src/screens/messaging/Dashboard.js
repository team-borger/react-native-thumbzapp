import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Alert, TouchableHighlight } from 'react-native';
import { List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Navigation } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { conversationsAPI, updateViewedAPI } from '../../services/messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [items, setItems] = useState([])

  const _goBack = () => {
    navigation.navigate('AuthRouteLanding');
  }

  const _onChatClick = (item) => {
    AsyncStorage.setItem('active_chat', JSON.stringify(item))
    updateViewedAPI(item.id, clickSuccess, clickError)
  }

  const clickSuccess = res => {
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

  const nameStyle = (payload) => {
    if (payload.viewed === false && payload.recepient_id !== payload.contact.id) {
      return {fontWeight: 'bold'}
    } else {
      return {color: 'gray', fontWeight: 'bold'}
    }
  }

  const otherStyle = (payload) => {
    if (payload.viewed === false && payload.recepient_id !== payload.contact.id) {
      return {fontSize: 12 ,fontWeight: 'bold'}
    } else {
      return {color: 'gray', fontSize: 12 ,fontWeight: 'bold'}
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      conversationsAPI(fetchSuccess, fetchError);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#880ED4' }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="white"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>Messages</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
      {/* <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Messages</Text>} />
      </Appbar.Header> */}
        <Card onPress={() => navigation.replace('SearchContactScreen')}>
          <Card.Content style={{display: 'flex', flexDirection: 'row'}}>
            <FontAwesome name='search' size={20} color='gray' style={{marginRight: 20}}/>
            <Text style={{fontWeight: 'bold', color: 'gray'}}>Search</Text>
          </Card.Content>
        </Card>
        <FlatList
          style={styles.scrollView}
          data={items}
          renderItem={({ item }) => (
            <Card key={item.id} style={item.viewed == true && item.recepient_id !== item.contact.id ? {marginBottom: 5} : {marginBottom: 5}} onPress={() => _onChatClick(item)}>
              <Card.Content style={{paddingHorizontal: 10, paddingVertical: 5}}>
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Avatar.Text style={styles.avatar} size={37} label={item.contact.first_name.charAt(0) + item.contact.last_name.charAt(0)} />
                    <View style={{marginLeft: 10, flex: 1}}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={nameStyle(item)}>{item.contact.first_name + ' ' + item.contact.last_name}</Text>
                        <Text style={otherStyle(item)}>{moment(item.date_created).format('hh:mm A')}</Text>
                      </View>
                      <Text style={otherStyle(item)}>{item.recepient_id === item.contact.id ? `You: ${item.spoiler_chat}` : item.spoiler_chat}</Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>


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
    padding: 15,
    height: '100%',
    marginTop: 10
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
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10
  },
  headerText : {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(Dashboard);
