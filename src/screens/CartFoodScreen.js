import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton } from 'react-native-paper';
import { Navigation } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartFoodAllAPI } from '../services/food';
import environment from '../../environment';

type Props = {
  navigation: Navigation;
};

const Cart = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)
  const [items, setItems] = useState([])
  const [loginuser, setUser] = useState({})

  const fetchSuccess = res => {
    setItems(res.data)
    setsubtotal(res.data)
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

  const changeQuantity = (value, payload) => {
    let index = items.findIndex(el => el.id === payload.id);
    items[index].quantity = value;
    setsubtotal()
  }

  const setsubtotal = (payload) => {
    var totalValue = 0
    for (let item of payload) {
      totalValue = totalValue + (item.quantity * item.foods[0].price)
    }
    setTotal(totalValue)
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen');
  }

  const _goToChats = () => {
    navigation.navigate('Dashboard');
  }

  const _onCheckoutPressed = () => {
    AsyncStorage.setItem('checkoutFood', JSON.stringify(items))
    AsyncStorage.setItem('paymentMethod', JSON.stringify({}))
    navigation.navigate('CheckoutFoodScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      _geUserInfo()
    }, [navigation])
  );

  const _geUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('user')
      if (value !== null) {
        const ret = JSON.parse(value);
        setUser(ret)
        _getCartInfo(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const _getCartInfo = (payload) => {
    let body = payload.id
    cartFoodAllAPI(body, fetchSuccess, fetchError)
  }

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Cart</Text>}/>
        <Appbar.Action icon="chat" color="#880ED4" onPress={_goToChats} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View key={item.id} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderTopColor: '#eeeeee',  borderTopWidth: 2,}}>
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Image source={{ uri: `${environment.APP_URL}/storage/uploads/foods/${item.foods[0].id}/${item.foods[0].images[0].photo}` }} style={styles.image} />
                    <View>
                      <Text style={{fontWeight: 'bold'}}>{item.foods[0].name}</Text>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {item.foods[0].price}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}> X {item.quantity}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold'}}>{'\u20B1'} {item.quantity * item.foods[0].price}</Text>
                  </View>

                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row'}}>
        <View style={styles.total}>
          <Text style={{marginLeft: 20}}>SubTotal:</Text>
          <Text style={{fontWeight: 'bold', marginLeft: 10, color: '#880ED4' }}>{'\u20B1'} {subTotal}</Text>
        </View>
        <Button style={styles.btn} mode="contained" onPress={_onCheckoutPressed}>
          Check out
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
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10
  },
  total: {
    flex: 1,
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
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

export default memo(Cart);
