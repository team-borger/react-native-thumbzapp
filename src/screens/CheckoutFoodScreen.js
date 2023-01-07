import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight, Platform, ToastAndroid, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import environment from '../../environment';
import { userAddressAPI } from '../services/address';
import { placeFoodOrderAPI } from '../services/food';

type Props = {
  navigation: Navigation;
};

const Checkout = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)
  const [items, setItems] = useState([])
  const [totalItem, setTotalItem] = useState([])
  const [payMethod, setPayment] = useState({})
  const [loginuser, setUser] = useState({})
  const [userAddress, setAddress] = useState({})

  const showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  const _getUserAddress = (payload) => {
    userAddressAPI(payload.id, getSuccess, getError)
  }

  const getSuccess = res => {
    setAddress(res.data)
  }

  const getError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      Alert.alert('Add Address Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Add Address Error', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  useEffect(() => {
    _getCheckout()
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _getCheckout()
    }, [navigation])
  );

  const _getCheckout = async () => {
    try {
      const value = await AsyncStorage.getItem('checkoutFood')
      const payment = await AsyncStorage.getItem('paymentMethod')
      const user = await AsyncStorage.getItem('user')
      if (value !== null) {
        const ret = JSON.parse(value);
        setItems(ret)
        setsubtotal(ret)
      }
      if (payment !== null) {
        const pay = JSON.parse(payment);
        setPayment(pay)
      }
      if (user !== null) {
        const userinfo = JSON.parse(user);
        setUser(userinfo)
        _getUserAddress(userinfo)
      }
    } catch (error) {
      console.log('error async storage', error)
    }
  }

  const setsubtotal = (payload) => {
    var totalValue = 0
    var totalItem = 0
    for (let item of payload) {
      totalValue = totalValue + (item.quantity * item.food.price)
      totalItem = totalItem + item.quantity
    }
    setTotal(totalValue)
    setTotalItem(totalItem)
  }

  const _goBack = () => {
    navigation.navigate('CartFoodScreen');
  }

  const addSuccess = res => {
    console.log(res.data)
  }

  const _onPlaceOrder = () => {
    if (payMethod.method_type) {
      for (let i of Object.keys(items)) {
        var payload = {
          cart_food_id: items[i].id,
          price_at_time_of_purchase: items[i].food.price,
          payment_method: payMethod.method_type
        }
        placeFoodOrderAPI(payload, addSuccess, getError)
        if(((+i)+1) === items.length) {
          navigation.navigate('PaymentSuccessFoodScreen')
        }
      }
    } else {
      showToast(`Please add payment method`)
    }
  }

  const _goPay = () => {
    AsyncStorage.setItem('payType', JSON.stringify('food'))
    navigation.navigate('PaymentOptions')
  }

  const formatNumber = (inputNumber) => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return(formetedNumber);
  }

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Checkout</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View
          style={{
            borderBottomColor: '#eeeeee',
            borderBottomWidth: 4,
          }}
        />
        <TouchableHighlight onPress={() => navigation.navigate('MyAddressCheckout')}  underlayColor="white" style={{borderColor: '#880ED4',  borderWidth: 1, margin: 10, padding: 10, borderRadius: 10}}>
          <View style={{ flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{userAddress.name}</Text>
                <Text style={{marginLeft: 10, color: '#777777'}}>{userAddress.phone}</Text>
              </View>
              <Text style={{color: '#555555'}}>{userAddress.address}</Text>
            </View>
            <View style={{width: '20%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <FontAwesome name='chevron-right' size={15} color='gray' />
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.skeks}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View key={item.id} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderTopColor: '#eeeeee',  borderTopWidth: 2,}}>
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Image source={{ uri: `${environment.APP_URL}/storage/uploads/foods/${item.food.id}/${item.food.images[0].photo}` }} style={styles.image} />
                    <View>
                      <Text style={{fontWeight: 'bold'}}>{item.food.name}</Text>
                      <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(item.food.price)}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{fontWeight: 'bold'}}></Text>
                    <Text style={{color: 'gray', fontSize: 12}}>x{item.quantity}</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.skeks}>
          <View style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={styles.alignCenterRow}>
              <View style={styles.alignCenterRow}>
                <Text>Total ( {totalItem} {totalItem > 1 ? 'Items' : 'Item'} )</Text>
              </View>
              <View>
                <Text style={{fontWeight: 'bold', color: '#880ED4'}}>{'\u20B1'} {formatNumber(subTotal)}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.skeks}>
          <TouchableHighlight onPress={_goPay} underlayColor="#eeeeee">
            <View
              style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
              <View style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                <FontAwesome name='credit-card' size={15} color='black' />
                <View style={{marginLeft: 5}}>
                  <Text>Payment Options</Text>
                </View>
              </View>
              <Text>{payMethod.method_type === 'E-Wallet' ? `E-Wallet - Gcash` : payMethod.method_type}</Text>
              <FontAwesome name='angle-right' size={20} color='black' />
            </View>
          </TouchableHighlight>
          <View style={{marginLeft: 50, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Image source={payMethod.account_number ? IMAGE.ICON_MASTERCARD : ''} style={styles.image} />
            <Text style={{color: '#880ED4'}}>{payMethod.account_number}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row'}}>
        <View style={styles.total}>
          <Text style={{marginLeft: 20}}>Total Payment:</Text>
          <Text style={{fontWeight: 'bold', marginLeft: 20, color: '#880ED4' }}>{'\u20B1'} {formatNumber(subTotal)}</Text>
        </View>
        <Button style={styles.btn} mode="contained" onPress={_onPlaceOrder}>
          Place Order
        </Button>
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
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10
  },
  total: {
    flex: 1,
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skeks: {
    borderTopColor: '#eeeeee',
    borderTopWidth: 3
  },
  contentContainer: {
      flex: 1
  },
  btn: {
    backgroundColor: '#880ED4',
    padding: 5
  },
  ground: {
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
  setColorText : {
    color: '#880ED4'
  },
  header: {
    backgroundColor: 'transparent',
    marginTop: 0
  }
});

export default memo(Checkout);
