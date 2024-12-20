import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const PaymentSuccessFood = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)

  useEffect(() => {
    _getCheckout()
  }, []);

  const _getCheckout = async () => {
    try {
      const value = await AsyncStorage.getItem('checkoutFood')
      if (value !== null) {
        const ret = JSON.parse(value);
        setsubtotal(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const setsubtotal = (payload) => {
    console.log(payload)
    var totalValue = 0
    var totalItem = 0
    for (let item of payload) {
      totalValue = totalValue + (item.quantity * item.food.price)
      totalItem = totalItem + item.quantity
    }
    setTotal(totalValue)
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen');
  }

  const _goToCart = () => {
    navigation.navigate('CartScreen')
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}></Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20}}>
          <Text style={{color: '#880ED4', fontSize: 24, fontWeight: 'bold'}}><FontAwesome name='check-circle' size={24} color='#880ED4' /> You paid {'\u20B1'} {subTotal}</Text>
          <Text style={{color: '#880ED4', fontSize: 16, textAlign: 'center', marginTop: 10}}>We have notified the seller to ship out your order.</Text>
          <View style={{marginTop: 40}}>
            <Button style={styles.logoutBtn} mode="outlined" color="#880ED4" onPress={_goBack}>
              Back to Home
            </Button>
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
  logoutBtn: {
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

export default memo(PaymentSuccessFood);
