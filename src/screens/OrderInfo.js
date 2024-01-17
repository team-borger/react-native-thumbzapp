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
import { userOrdersAPI, cancelOrdersAPI } from '../services/products';

type Props = {
  navigation: Navigation;
};

const OrderInfo = ({ navigation }: Props) => {
  const [orderinfo, setOrderInfo] = useState({})
  const [orderitems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      getOrderInfo()
    }, [navigation])
  );

  const getOrderInfo = async () => {
    try {
      const skeks = await AsyncStorage.getItem('orderinfo')
      if (skeks !== null) {
        const skek = JSON.parse(skeks);
        setOrderInfo(skek)
        setOrderItems(skek.items)
      }
    } catch (error) {
      console.log('error async storage: ', error)
    }
  }

  const _goBack = () => {
    AsyncStorage.setItem('orderinfo', JSON.stringify({}))
    navigation.navigate('OrdersScreen')
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

  const statusChecker = (payload) => {
    if (orderinfo.status) {
      if (orderinfo.status.status === 'Waiting for Payment') {
        return 'Pending Payment'
      } else if (orderinfo.status.status === 'Paid' || orderinfo.status.status === 'Pending' || orderinfo.status.status === 'Processing' || orderinfo.status.status === 'Packed') {
        return 'Seller is preparing your order'
      } else if (orderinfo.status.status === 'Shipped') {
        return 'Your order is on the way'
      } else if (orderinfo.status.status === 'Delivered') {
        return 'Order Completed'
      }
    }
  }

  const cancelOrder = () => {
    setLoading(true)
    cancelOrdersAPI(orderinfo, cancelSuccess, cancelError)
  }

  const cancelSuccess = res => {
    setLoading(false)
    console.log(res)
    navigation.navigate('ProfileScreen')
  }

  const cancelError = err => {
    console.log(err)
    setLoading(false)
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
          <Text style={styles.headerText}>Order Details</Text>
        </View>
      </View>
      <View>
        <View style={{padding: 20, backgroundColor: '#880ED4'}}>
          <Text style={{color: 'white'}}>{statusChecker()}</Text>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 10}}>
          <View style={{width: '10%', alignItems: 'center', paddingVertical: 7}}>
            <FontAwesome name='map-marker' size={15} color='gray' />
          </View>
          <View style={{width: '80%', paddingBottom: 10}}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 14, paddingVertical: 5}}>Delivery Address</Text>
              <Text style={{color: '#777777'}}>{orderinfo.address ? orderinfo.address.name : ''}</Text>
              <Text style={{color: '#777777'}}>{orderinfo.address? orderinfo.address.phone : ''}</Text>
            </View>
            <Text style={{color: '#555555'}}>{orderinfo.address ? orderinfo.address.address : ''}</Text>
          </View>
        </View>
        <View style={{padding: 5, backgroundColor: '#eeeeee', marginBottom: 10}}></View>
        <FlatList
          data={orderitems}
          renderItem={({ item }) => (
            <View key={item.id} style={{paddingHorizontal: 10}}>
              <View style={{flexDirection: 'row', alignItems:'center'}}>
                <View style={{width: '70%'}}>
                  <View style={styles.alignCenterRow}>
                    <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.product.id}/${item.product.images[0].photo}` }} style={styles.image} />
                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: 'bold'}}>{item.product.name}</Text>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.price_at_time_of_purchase)}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}> X {item.quantity}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '30%',}}>
                  <Text style={{color: '#880ED4', fontSize: 13, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(item.quantity * item.price_at_time_of_purchase)}</Text>
                </View>
              </View>
              <View style={{borderBottomColor: '#eeeeee',  borderBottomWidth: 1, marginVertical: 10}}></View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={{flexDirection: 'row', alignItems:'center', paddingHorizontal: 10, paddingBottom: 15}}>
          <View style={{width: '50%', paddingHorizontal: 15}}>
            <Text style={{color: '#555555'}}>Order Total</Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingVertical: 2, width: '50%'}}>
            <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'right'}}>{'\u20B1'} {formatNumber(totalTransaction(orderitems))}</Text>
          </View>
        </View>
        <View style={{padding: 5, backgroundColor: '#eeeeee', marginBottom: 10}}></View>
        <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 10 }}>
          <Button mode="outlined" style={{borderRadius: 5}} onPress={cancelOrder} loading={loading} disabled={loading}>
            Cancel Order
          </Button>
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
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#880ED4'
  },
  notActiveTextTab: {
    fontSize: 11,
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

export default memo(OrderInfo);
