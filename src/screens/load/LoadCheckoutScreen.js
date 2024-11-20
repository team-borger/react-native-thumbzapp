import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton } from 'react-native-paper';
import { Navigation } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkoutLoadAPI, networkInfoAPI } from '../../services/load';
import environment from '../../../environment';

type Props = {
  navigation: Navigation;
};

const LoadCheckout = ({ navigation }: Props) => {
  const [loginuser, setUser] = useState({})
  const [networkInfo, setNetworkInfo] = useState({})
  const [loadInfo, setLoadInfo] = useState({})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const _goBack = () => {
    navigation.navigate('LoadProcessScreen');
  }

  const loadPay = () => {
    setLoading(true)
    checkoutLoadAPI({ 
      amount: loadInfo.amount
    }, openWebViewer, getError)
  }

  const getError = err => {
    const { error, message } = err.response.data;
    setLoading(false);
    if (error) {
      Alert.alert('Error: ', error, [{ text: 'OK' }], {
        cancelable: false,
      });
    }
    if (message) {
      Alert.alert('Error: ', message, [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  const openWebViewer = res => {
    console.log('callback', res.data.paymentLink.invoice_url)
    const path = res.data.paymentLink.invoice_url
    AsyncStorage.setItem('xenditInvoiceLoadUrl', path)
    navigation.navigate('XenditInvoiceLoad');
    setLoading(false)
  }

  const _getNetworkInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('networkInfo')
      if (value !== null) {
        const ret = JSON.parse(value);
        _getInfo(ret.provider)
        setPhoneNumber(ret.numberinfo.phone_number)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const fetchSuccess = res => {
    setNetworkInfo(res.data)
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

  const _getInfo = (payload) => {
    networkInfoAPI(payload, fetchSuccess, fetchError)
  }

  useFocusEffect(
    React.useCallback(() => {
      _geUserInfo()
      _geLoadInfo()
      _getNetworkInfo()
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
      const value = await AsyncStorage.getItem('loadCheckout');
      if (value !== null) {
        const ret = JSON.parse(value);
        setLoadInfo(ret)
      }
    } catch (error) {
      console.log('error async storage: ', error)
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
          <View style={{padding: 10, backgroundColor: '#f9efff'}}>
            <Text style={{color: '#880ED4', fontSize:12, fontWeight: 'bold'}}>YOU ARE ABOUT TO PAY</Text>
          </View>
          <View style={{marginHorizontal: 20, marginVertical: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Image
              style={{width: 50, aspectRatio: 1, resizeMode: 'contain'}}
              source={{
                uri: networkInfo.images ? networkInfo.images.length > 0 ? `${environment.APP_URL}/storage/uploads/networks/${networkInfo.id}/${networkInfo.images[0].photo}` : '' : '',
              }}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#880ED4', fontSize: 20, fontWeight: 'bold'}}>{loadInfo.load_type === 'Regular' ? `PHP ${loadInfo.amount}.00` : loadInfo.promo_name}</Text>
            <Text style={{fontSize: 15, marginTop: 5}}>{phoneNumber}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between', padding: 20, borderBottomColor: '#eeeeee', borderBottomWidth: 2}}>
            <Text>Total Amount</Text>
            <Text style={{fontWeight: 'bold'}}>{ `PHP ${loadInfo.amount}.00` }</Text>
          </View>

          <View>
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
