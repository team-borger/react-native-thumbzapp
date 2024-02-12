import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton } from 'react-native-paper';
import { Navigation } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartFoodAllAPI } from '../../services/food';
import environment from '../../../environment';

type Props = {
  navigation: Navigation;
};

const LoadCheckout = ({ navigation }: Props) => {
  const [loginuser, setUser] = useState({})
  const [loadInfo, setLoadInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayment] = useState({})

  const _goBack = () => {
    navigation.navigate('LoadProcessScreen');
  }

  const loadPay = () => {
    navigation.navigate('LoadPayedScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      _geUserInfo()
      _geLoadInfo()
    }, [navigation])
  );

  const _geUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('user')
      if (value !== null) {
        const ret = JSON.parse(value);
        setUser(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const _geLoadInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('loadCheckout')
      const payment = await AsyncStorage.getItem('paymentMethodLoad')
      if (value !== null) {
        const ret = JSON.parse(value);
        setLoadInfo(ret)
      }
      if (payment !== null) {
        const pay = JSON.parse(payment);
        setPayment(pay)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const _goPay = () => {
    navigation.navigate('PaymentOptionLoad')
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Payment</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
          <View style={{paddingVertical: 30, backgroundColor: '#880ED4', alignItems: 'center'}}>
            <Text style={{color:'white', fontSize: 20, fontWeight: 'bold'}}>{loadInfo.load_type === 'Regular' ? `PHP ${loadInfo.amount}` : loadInfo.promo_name}</Text>
          </View>
          <View style={{padding: 10, backgroundColor: '#f9efff'}}>
            <Text style={{color: '#880ED4', fontSize:12, fontWeight: 'bold'}}>YOU ARE ABOUT TO PAY</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', padding: 20, borderBottomColor: '#eeeeee', borderBottomWidth: 2}}>
            <Text>Total Amount</Text>
            <Text style={{fontWeight: 'bold'}}>PHP {loadInfo.amount}</Text>
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

          <View style={payMethod.method_type ? {} : {display: 'none'}}>
            <View style={{paddingHorizontal: '15%', paddingVertical: 20}}>
              <Text style={{textAlign: 'center', color: '#777777', fontSize: 13}}>Please review to ensure that the details are correct before you proceed.</Text>
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Button mode="contained" style={styles.btn} onPress={() => {loadPay()}}>
                {loading ? 'Paying...' : `PAY PHP ${loadInfo.amount}.00`}
              </Button>
            </View>
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
    padding: 5,
    borderRadius: 0
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

export default memo(LoadCheckout);
