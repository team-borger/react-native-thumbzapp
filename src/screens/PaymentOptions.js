import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import { useFocusEffect } from '@react-navigation/native';
import { getCardListAPI, deleteCardAPI } from '../services/payment';
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

  const deleteSuccess = res => {
    setState(false)
    getCardListAPI(fetchSuccess,fetchError);
    navigation.navigate('PaymentMethodList')
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

  useFocusEffect(
    React.useCallback(() => {
      getCardListAPI(fetchSuccess,fetchError);
    }, [navigation])
  );

  const _goBack = () => {
    navigation.navigate('CheckoutScreen');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Payment Methods</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <List.AccordionGroup>
            <List.Accordion id="1"
              title={
                <View style={styles.alignCenterRow}>
                  <FontAwesome name='credit-card' size={15} color='gray'/>
                  <View style={{marginRight: 10}}></View>
                  <Text>Credit / Debit Card</Text>
                </View>
              }
            >
              <List.Item style={{padding:0, margin: 0, paddingHorizontal: 25}} title={
                <FlatList
                  data={items}
                  renderItem={({ item }) => (
                    <View key={item.id} style={{borderBottomColor: 'white', borderBottomWidth: 1}}>
                      <View style={styles.alignCenterRow}>
                        <View style={styles.alignCenterRow}>
                          <Image source={IMAGE.ICON_MASTERCARD} style={styles.image} />
                          <View>
                            <Text style={{fontWeight: 'bold'}}>{item.account_number}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              }/>
              <List.Item style={{padding:10, margin: 0, paddingHorizontal: 25}}  onPress={() => navigation.navigate('AddCardScreen')} title={
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <FontAwesome name='plus' size={15} color='gray'/>
                    <View style={{marginRight: 10}}></View>
                    <View>
                      <Text style={{fontWeight: 'bold'}}>ADD NEW</Text>
                    </View>
                  </View>
                </View>
              }/>
            </List.Accordion>
            <List.Accordion id="2"
              title={
                <View style={styles.alignCenterRow}>
                  <FontAwesome name='mobile' size={20} color='gray'/>
                  <View style={{marginRight: 10}}></View>
                  <Text>E-Wallet</Text>
                </View>
              }
            >
              <List.Item style={{padding:0, margin: 0, paddingHorizontal: 25}} title={
                <Text>No Item</Text>
              }/>
            </List.Accordion>
          </List.AccordionGroup>
        </View>
        <Button style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('CheckoutScreen')}>
          Confirm
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
