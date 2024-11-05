import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ToastAndroid, Alert, TouchableHighlight, Image,TouchableOpacity } from 'react-native';
import { Appbar, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { networkInfoAPI } from '../../services/load';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import environment from '../../../environment';
import { userOrdersAPI } from '../../services/products';

type Props = {
  navigation: Navigation;
};

const Orders = ({ navigation }: Props) => {
  const [tabNow, setTabNow] = useState('pay')
  const [toPay, setToPay] = useState({})
  const [toShip, setToShip] = useState({})
  const [toReceive, setToReceive] = useState({})
  const [completed, setCompleted] = useState({})
  const [cancelled, setCancelled] = useState({})
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
    const pay = items.filter((obj) => obj.status.status === 'Waiting for Payment')
    const ship = items.filter((obj) => obj.status.status === 'Paid' || obj.status.status === 'Pending' || obj.status.status === 'Processing' || obj.status.status === 'Packed')
    const receive = items.filter((obj) => obj.status.status === 'Shipped')
    const complete = items.filter((obj) => obj.status.status === 'Delivered')
    const cancel = items.filter((obj) => obj.status.status === 'cancelled')
    setToPay(pay)
    setToShip(ship)
    setToReceive(receive)
    setCompleted(complete)
    setCancelled(cancel)
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

  const totalTransaction = (payload) => {
    var customtotal = 0
    for (var item of payload) {
      customtotal += (+item.price_at_time_of_purchase) * (+item.quantity)
    }
    return customtotal
  }

  const orderInfo = (payload) => {
    AsyncStorage.setItem('orderinfo', JSON.stringify(payload))
    navigation.navigate('OrderInfo')
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
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5}}>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('pay')}} style={ tabNow === 'pay' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'pay' ? styles.activeTextTab : styles.notActiveTextTab}>To Pay</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('ship')}} style={ tabNow === 'ship' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'ship' ? styles.activeTextTab : styles.notActiveTextTab}>To Ship</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('receive')}} style={ tabNow === 'receive' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'receive' ? styles.activeTextTab : styles.notActiveTextTab}>To Receive</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('complete')}} style={ tabNow === 'complete' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'complete' ? styles.activeTextTab : styles.notActiveTextTab}>Completed</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('cancel')}} style={ tabNow === 'cancel' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'cancel' ? styles.activeTextTab : styles.notActiveTextTab}>Cancelled</Text>
            </TouchableHighlight>
          </View>
          <View style={tabNow === 'pay' ? {} : {display: 'none'}}>
            <FlatList
              data={toPay}
              renderItem={({ item }) => (
                <View>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                  <TouchableOpacity key={item.id} onPress={() => {orderInfo(item)}} style={{marginBottom: 5, paddingVertical: 10, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '70%'}}>
                        <View style={styles.alignCenterRow}>
                          <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.items[0].product.id}/${item.items[0].product.images[0].photo}` }} style={styles.image} />
                          <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>{item.items[0].product.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.items[0].price_at_time_of_purchase)}</Text>
                              <Text style={{color: 'gray', fontSize: 12}}> X {item.items[0].quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                        <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.items[0].quantity * item.items[0].price_at_time_of_purchase)}</Text>
                      </View>
                    </View>
                    <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    <View style={item.items.length > 1 ? {} : {display: 'none'}}>
                      <Text style={{color: '#777777', textAlign: 'center'}}>View more product</Text>
                      <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '50%', paddingHorizontal: 15}}>
                        <Text style={{color: '#555555'}}>Order Total</Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
                        <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(item.items))}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'ship' ? {} : {display: 'none'}}>
            <FlatList
              data={toShip}
              renderItem={({ item }) => (
                <View>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                  <TouchableOpacity key={item.id} onPress={() => {orderInfo(item)}} style={{marginBottom: 5, paddingVertical: 10, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '70%'}}>
                        <View style={styles.alignCenterRow}>
                          <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.items[0].product.id}/${item.items[0].product.images[0].photo}` }} style={styles.image} />
                          <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>{item.items[0].product.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.items[0].price_at_time_of_purchase)}</Text>
                              <Text style={{color: 'gray', fontSize: 12}}> X {item.items[0].quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                        <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.items[0].quantity * item.items[0].price_at_time_of_purchase)}</Text>
                      </View>
                    </View>
                    <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    <View style={item.items.length > 1 ? {} : {display: 'none'}}>
                      <Text style={{color: '#777777', textAlign: 'center'}}>View more product</Text>
                      <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '50%', paddingHorizontal: 15}}>
                        <Text style={{color: '#555555'}}>Order Total</Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
                        <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(item.items))}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'receive' ? {} : {display: 'none'}}>
            <FlatList
              data={toReceive}
              renderItem={({ item }) => (
                <View>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                  <TouchableOpacity key={item.id} onPress={() => {orderInfo(item)}} style={{marginBottom: 5, paddingVertical: 10, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '70%'}}>
                        <View style={styles.alignCenterRow}>
                          <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.items[0].product.id}/${item.items[0].product.images[0].photo}` }} style={styles.image} />
                          <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>{item.items[0].product.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.items[0].price_at_time_of_purchase)}</Text>
                              <Text style={{color: 'gray', fontSize: 12}}> X {item.items[0].quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                        <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.items[0].quantity * item.items[0].price_at_time_of_purchase)}</Text>
                      </View>
                    </View>
                    <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    <View style={item.items.length > 1 ? {} : {display: 'none'}}>
                      <Text style={{color: '#777777', textAlign: 'center'}}>View more product</Text>
                      <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '50%', paddingHorizontal: 15}}>
                        <Text style={{color: '#555555'}}>Order Total</Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
                        <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(item.items))}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'complete' ? {} : {display: 'none'}}>
            <FlatList
              data={completed}
              renderItem={({ item }) => (
                <View>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                  <TouchableOpacity key={item.id} onPress={() => {orderInfo(item)}} style={{marginBottom: 5, paddingVertical: 10, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '70%'}}>
                        <View style={styles.alignCenterRow}>
                          <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.items[0].product.id}/${item.items[0].product.images[0].photo}` }} style={styles.image} />
                          <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>{item.items[0].product.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.items[0].price_at_time_of_purchase)}</Text>
                              <Text style={{color: 'gray', fontSize: 12}}> X {item.items[0].quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                        <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.items[0].quantity * item.items[0].price_at_time_of_purchase)}</Text>
                      </View>
                    </View>
                    <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    <View style={item.items.length > 1 ? {} : {display: 'none'}}>
                      <Text style={{color: '#777777', textAlign: 'center'}}>View more product</Text>
                      <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '50%', paddingHorizontal: 15}}>
                        <Text style={{color: '#555555'}}>Order Total</Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
                        <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(item.items))}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={tabNow === 'cancel' ? {} : {display: 'none'}}>
            <FlatList
              data={cancelled}
              renderItem={({ item }) => (
                <View>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                  <TouchableOpacity key={item.id} onPress={() => {orderInfo(item)}} style={{marginBottom: 5, paddingVertical: 10, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '70%'}}>
                        <View style={styles.alignCenterRow}>
                          <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.items[0].product.id}/${item.items[0].product.images[0].photo}` }} style={styles.image} />
                          <View style={{flex: 1}}>
                            <Text style={{fontWeight: 'bold'}}>{item.items[0].product.name}</Text>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.items[0].price_at_time_of_purchase)}</Text>
                              <Text style={{color: 'gray', fontSize: 12}}> X {item.items[0].quantity}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                        <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.items[0].quantity * item.items[0].price_at_time_of_purchase)}</Text>
                      </View>
                    </View>
                    <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    <View style={item.items.length > 1 ? {} : {display: 'none'}}>
                      <Text style={{color: '#777777', textAlign: 'center'}}>View more product</Text>
                      <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <View style={{width: '50%', paddingHorizontal: 15}}>
                        <Text style={{color: '#555555'}}>Order Total</Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
                        <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(item.items))}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{padding: 5, backgroundColor: '#eeeeee'}}></View>
                </View>
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
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#880ED4'
  },
  activeTextTab: {
    fontSize: 11,
    textAlign: 'center',
    color: '#880ED4'
  },
  notActiveTextTab: {
    fontSize: 11,
    textAlign: 'center'
  },
  notActiveTab: {
    padding: 10,
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
