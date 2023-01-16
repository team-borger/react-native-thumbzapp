import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import { useFocusEffect } from '@react-navigation/native';
import { allAddressAPI } from '../services/address';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {
  navigation: Navigation;
};

const ChatScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState([])
  const [showAlert, setState] = useState(false)
  const [choosenItem, setItem] = useState({})

  const hideAlert = () => {
    setState(false);
  };

  const fetchSuccess = res => {
    setItems(res.data)
    setState(false)
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

  const _deleteConfirm = (payload) => {
    setItem({})
    setItem(payload)
    setState(true);
  }

  const _deleteCard = () => {
    deleteCardAPI(choosenItem, deleteSuccess, fetchError);
  }

  const updateAddress = (payload) => {
    AsyncStorage.setItem('choosenAddress', JSON.stringify(payload))
    navigation.navigate('AddAddressCheckout')
  }

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.setItem('choosenAddress', JSON.stringify({}))
      allAddressAPI(fetchSuccess,fetchError);
    }, [navigation])
  );

  const _goBack = () => {
    navigation.navigate('CheckoutScreen');
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>My Address</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{color: '#777777'}}>Address</Text>
        </View>
        <View style={{flex: 1, paddingTop: 2}}>
          <FlatList
            style={styles.scrollView}
            data={items}
            renderItem={({ item }) => (
              <TouchableHighlight key={item.id} onPress={() => updateAddress(item)} underlayColor="white">
                <Card style={styles.customCard}>
                  <Card.Content>
                    <View style={styles.alignCenterRow}>
                      <View style={{width: '80%'}}>
                        <Text style={{color: 'gray'}}>{item.name} | {item.phone}</Text>
                        <Text>{item.address}</Text>
                      </View>
                      <View style={item.default === true ? {padding: 3, borderColor: 'red', borderWidth: 1, alignSelf: 'flex-start', marginTop: 5} : {}}>
                        <Text style={{color: 'red', fontSize: 10}}>{item.default === true ? 'Default' : ''}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableHighlight>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Button icon="plus-circle" style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('AddAddressCheckout')}>
          Add New Address
        </Button>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Are you sure?"
          message="This won't be reverted!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={hideAlert}
          onConfirmPressed={_deleteCard}
        />

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
    margin: 2
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: '#eeeeee'
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10,
    borderRadius: 0
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
    backgroundColor: 'white',
    marginTop: 0
  }
});
