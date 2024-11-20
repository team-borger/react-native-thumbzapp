import React, { memo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, RadioButton } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import environment from '../../../environment';
import { userAddressAPI } from '../../services/address';
import { placeOrderAPI, checkoutAPI } from '../../services/products';
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {
  navigation: Navigation,
};

const CheckoutFood = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [totalItem, setTotalItem] = useState([]);
  const [payMethod, setPayment] = useState({});
  const [loginuser, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [userAddress, setAddress] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = React.useState('CASH');
  const [showAlert, setState] = useState(false)

  const hideAlert = () => {
    setState(false);
    navigation.navigate('HomeScreen')
  };

  const showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  useEffect(() => {
    _getCheckout();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _getCheckout();
    }, [navigation])
  );

  const _getUserAddress = payload => {
    userAddressAPI(payload.id, getSuccess, getError);
  };

  const getSuccess = async res => {
    setAddress(res.data);
    const address = await AsyncStorage.getItem('choosenAddress');
    if (Object.keys(address).length < 3) {
      setSelectedAddress(res.data);
    } else {
      const addressinfo = JSON.parse(address);
      setSelectedAddress(addressinfo);
    }
  };

  const getError = err => {
    console.error(err);
    const { error, message } = err.response.data;
    setLoading(false);
    if (error) {
      Alert.alert('Add Address Error', error, [{ text: 'OK' }], {
        cancelable: false,
      });
    }
    if (message) {
      Alert.alert('Add Address Error', message, [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  const _getCheckout = async () => {
    try {
      const value = await AsyncStorage.getItem('checkoutFood');
      const user = await AsyncStorage.getItem('user');
      if (value !== null) {
        const ret = JSON.parse(value);
        setItems(ret);
        setsubtotal(ret);
      }
      if (user !== null) {
        const userinfo = JSON.parse(user);
        setUser(userinfo);
        _getUserAddress(userinfo);
      }
    } catch (error) {
      console.log('error async storage');
    }
  };

  const setsubtotal = payload => {
    var totalValue = 0;
    var totalItem = 0;
    for (let item of payload) {
      totalValue = totalValue + item.quantity * item.food.price;
      totalItem = totalItem + item.quantity;
    }
    setTotal(totalValue);
    setTotalItem(totalItem);
  };

  const _goBack = () => {
    navigation.navigate('CartFoodScreen');
  };

  const _onPlaceOrder = () => {
    setLoading(true);
    const cart_id = items.map(obj => obj.id);
    if(paymentMethod == 'ONLINE') {
      checkoutAPI({ 
        food_orders: true,
        ids: cart_id,
        cod: false,
        user_address_id: selectedAddress.id 
      }, openWebViewer, getError)
    } else{
      checkoutAPI({ 
        food_orders: true,
        ids: cart_id,
        cod: true,
        user_address_id: selectedAddress.id 
      }, addSuccess, getError)
      placeOrderAPI({ids: cart_id, food_orders: true}, placeSuccess, getError)
    }
  };

  const placeSuccess = res => {
    console.log(res.data)
  }

  const addSuccess = res => {
    setState(true);
    setLoading(false)
  }

  const openWebViewer = res => {
    // console.log('callback', res.data.paymentLink.invoice_url)
    const path = res.data.paymentLink.invoice_url
    AsyncStorage.setItem('xenditInvoiceUrl', path)
    // console.log(path)
    navigation.navigate('XenditInvoice');
    setLoading(false)
  }

  // const _goPay = () => {
  //   AsyncStorage.setItem('payType', JSON.stringify('shop'));
  //   navigation.navigate('PaymentOptions');
  // };

  const formatNumber = inputNumber => {
    let formetedNumber = Number(inputNumber)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return formetedNumber;
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content
          style={styles.marginText}
          title={<Text style={styles.setColorText}>Checkout</Text>}
        />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View
          style={{
            borderBottomColor: '#eeeeee',
            borderBottomWidth: 4,
          }}
        />
        <TouchableHighlight
          onPress={() =>
            navigation.navigate('MyAddressCheckout', { isFood: true })
          }
          underlayColor="white"
          style={selectedAddress.phone ? {
            borderColor: '#880ED4',
            borderWidth: 1,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          } : {display: 'none'}}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '80%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {selectedAddress.name}
                </Text>
                <Text style={{ marginLeft: 10, color: '#777777' }}>
                  {selectedAddress.phone}
                </Text>
              </View>
              <Text style={{ color: '#555555' }}>
                {selectedAddress.address}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <FontAwesome name="chevron-right" size={15} color="gray" />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            navigation.navigate('MyAddressCheckout', { isFood: true })
          }
          underlayColor="white"
          style={selectedAddress.phone ? {display: 'none'} :{
            borderColor: '#880ED4',
            borderWidth: 1,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '80%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {selectedAddress.name}
                </Text>
                <Text style={{ marginLeft: 10, color: '#777777' }}>
                  {selectedAddress.phone}
                </Text>
              </View>
              <Text style={{ color: '#555555' }}>
                {selectedAddress.address}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <FontAwesome name="chevron-right" size={15} color="gray" />
            </View>
          </View>
        </TouchableHighlight>
        <View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  marginBottom: 5,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderBottomColor: '#eeeeee',
                  borderBottomWidth: 2,
                }}
              >
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Image
                      source={{
                        uri: `${environment.APP_URL}/storage/uploads/foods/${item.food.id}/${item.food.images[0].photo}`,
                      }}
                      style={styles.image}
                    />
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.food.name}
                      </Text>
                      <Text style={{ color: '#880ED4', fontSize: 12 }}>
                        {'\u20B1'} {formatNumber(item.food.price)}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}></Text>
                    <Text style={{ color: 'gray', fontSize: 12 }}>
                      x{item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <View>
          <View
            style={{
              marginBottom: 5,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View style={styles.alignCenterRow}>
              <View style={styles.alignCenterRow}>
                <Text>
                  Total ( {totalItem} {totalItem > 1 ? 'Items' : 'Item'} )
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#880ED4' }}>
                  {'\u20B1'} {formatNumber(subTotal)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={styles.titleText}>Payment Method</Text>

          <View>
            <RadioButton.Group
              onValueChange={newValue => setPaymentMethod(newValue)}
              value={paymentMethod}
            >
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Cash On Delivery</Text>
                  <RadioButton value="CASH" />
                </View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Online Payment</Text>
                  <RadioButton value="ONLINE" />
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.total}>
          <Text style={{ marginLeft: 20 }}>Total Payment:</Text>
          <Text
            style={{ fontWeight: 'bold', marginLeft: 20, color: '#880ED4' }}
          >
            {'\u20B1'} {formatNumber(subTotal)}
          </Text>
        </View>
        <Button
          loading={loading}
          disabled={!selectedAddress}
          style={styles.btn}
          mode="contained"
          onPress={_onPlaceOrder}
        >
          Place Order
        </Button>
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title=""
        message="Placed Order Successfully!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#880ED4"
        onConfirmPressed={hideAlert}
      />

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
    marginRight: 10,
  },
  total: {
    flex: 1,
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeks: {
    borderTopColor: '#eeeeee',
    borderTopWidth: 3,
  },
  contentContainer: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#880ED4',
    padding: 5,
    borderRadius: 0,
  },
  ground: {
    paddingTop: 0,
    padding: 20,
    height: '100%',
  },
  marginText: {
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  setColorText: {
    color: '#880ED4',
  },
  header: {
    backgroundColor: 'transparent',
    marginTop: 0,
  },
});

export default memo(CheckoutFood);
