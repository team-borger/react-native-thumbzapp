import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ToastAndroid, Alert, TouchableHighlight, Image,TouchableOpacity } from 'react-native';
import { Appbar, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { networkInfoAPI } from '../services/load';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import environment from '../../environment';
import { userOrdersAPI } from '../services/products';

type Props = {
  navigation: Navigation;
};

const Orders = ({ navigation }: Props) => {
  const [tabNow, setTabNow] = useState('ship')
  const [toShip, setToShip] = useState({})
  const [toReceive, setToReceive] = useState({})
  const [completed, setCompleted] = useState({})
  const [loginUser, setLoginUser] = useState({})

  useFocusEffect(
    React.useCallback(() => {
      getStatus()
      getLoginUser()
    }, [navigation])
  );

  const getStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('ordersStatus')
      if (value !== null) {
        setTabNow(value)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const getLoginUser = async () => {
    try {
      const skeks = await AsyncStorage.getItem('user')
      if (skeks !== null) {
        const skek = JSON.parse(skeks);
        setLoginUser(skek)
        userOrdersAPI(skek.id, fetchSuccess, fetchError)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const fetchSuccess = res => {
    var items = res.data
    const ship = items.filter((obj) => obj.status.status_option.status === 'Pending' || obj.status.status_option.status === 'Processing' || obj.status.status_option.status === 'Packed')
    const receive = items.filter((obj) => obj.status.status_option.status === 'Shipped')
    const complete = items.filter((obj) => obj.status.status_option.status === 'Delivered')
    setToShip(ship)
    setToReceive(receive)
    setCompleted(complete)
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

  const _goBack = () => {
    navigation.navigate('ProfileScreen')
  }

  const formatNumber = (inputNumber) => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return(formetedNumber);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="#333"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>My Orders</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('ship')}} style={ tabNow === 'ship' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'ship' ? styles.activeTextTab : styles.notActiveTextTab}>To Ship</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('receive')}} style={ tabNow === 'receive' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'receive' ? styles.activeTextTab : styles.notActiveTextTab}>To Receive</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('complete')}} style={ tabNow === 'complete' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'complete' ? styles.activeTextTab : styles.notActiveTextTab}>Completed</Text>
            </TouchableHighlight>
          </View>
          <View style={tabNow === 'ship' ? {} : {display: 'none'}}>
            <FlatList
              data={toShip}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.id} onPress={() => {}} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderBottomColor: '#eeeeee',  borderBottomWidth: 2, width: '100%'}}>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <View style={{width: '75%'}}>
                      <View style={styles.alignCenterRow}>
                        <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.cart.product.id}/${item.cart.product.images[0].photo}` }} style={styles.image} />
                        <View style={{flex: 1}}>
                          <Text style={{fontWeight: 'bold'}}>{item.cart.product.name}</Text>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.price_at_time_of_purchase)}</Text>
                            <Text style={{color: 'gray', fontSize: 12}}> X {item.cart.quantity}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%',}}>
                      <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} {formatNumber(item.cart.quantity * item.price_at_time_of_purchase)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'receive' ? {} : {display: 'none'}}>
            <FlatList
              data={toReceive}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.id} onPress={() => {}} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderBottomColor: '#eeeeee',  borderBottomWidth: 2, width: '100%', flexDirection: 'row', alignItems:'center'}}>
                  <View style={{width: '75%'}}>
                    <View style={styles.alignCenterRow}>
                      <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.cart.product.id}/${item.cart.product.images[0].photo}` }} style={styles.image} />
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold'}}>{item.cart.product.name}</Text>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.price_at_time_of_purchase)}</Text>
                          <Text style={{color: 'gray', fontSize: 12}}> X {item.cart.quantity}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%',}}>
                    <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} {formatNumber(item.cart.quantity * item.price_at_time_of_purchase)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'complete' ? {} : {display: 'none'}}>
            <FlatList
              data={completed}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.id} onPress={() => {}} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderBottomColor: '#eeeeee',  borderBottomWidth: 2, width: '100%', flexDirection: 'row', alignItems:'center'}}>
                  <View style={{width: '75%'}}>
                    <View style={styles.alignCenterRow}>
                      <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.cart.product.id}/${item.cart.product.images[0].photo}` }} style={styles.image} />
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold'}}>{item.cart.product.name}</Text>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.price_at_time_of_purchase)}</Text>
                          <Text style={{color: 'gray', fontSize: 12}}> X {item.cart.quantity}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%',}}>
                    <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} {formatNumber(item.cart.quantity * item.price_at_time_of_purchase)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
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
  loadNotActive: {
    borderWidth: 1,
    borderColor: '#880ED4',
    borderRadius: 10,
    padding: 5,
    width: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadActive: {
    backgroundColor: '#880ED4',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    padding: 5,
    width: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadNotActiveText: {
    color: '#880ED4',
    fontWeight: 'bold',
    fontSize: 20
  },
  loadActiveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  activeTab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#880ED4'
  },
  activeTextTab: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#880ED4'
  },
  notActiveTextTab: {
    textAlign: 'center'
  },
  notActiveTab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf'
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10
  },
  contentContainer: {
      flex: 1
  },
  headerText : {
    color: '#880ED4',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default memo(Orders);
