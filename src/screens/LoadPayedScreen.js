import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton } from 'react-native-paper';
import { Navigation } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../components/NavbarBot';
import AppbarButton from '../components/AppbarButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartFoodAllAPI } from '../services/food';
import environment from '../../environment';
import moment from 'moment';

type Props = {
  navigation: Navigation;
};

const LoadPayed = ({ navigation }: Props) => {
  const [loginuser, setUser] = useState({})
  const [loadInfo, setLoadInfo] = useState({})
  const [loading, setLoading] = useState(false)

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
      if (value !== null) {
        const ret = JSON.parse(value);
        setLoadInfo(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  return (
    <SafeAreaView style={styles.container}>

    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#880ED4' }}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.headerText}>Payment</Text>
      </View>
      <AppbarButton mode="contained" onPress={() => navigation.navigate('HomeScreen')}>
        DONE
      </AppbarButton>
    </View>

      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
          <View style={{padding: 10, backgroundColor: '#f9efff'}}>
            <Text style={{color: '#880ED4', fontSize:15, fontWeight: 'bold', textAlign: 'center'}}>Payment Received</Text>
          </View>
          <View style={{paddingVertical: 30, alignItems: 'center', borderBottomColor: '#eeeeee', borderBottomWidth: 2}}>
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>{`PHP ${loadInfo.amount}`}.00</Text>
          </View>
          <View style={{padding: 20, borderBottomColor: '#eeeeee', borderBottomWidth: 2}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom: 10}}>
              <Text>Amount Due</Text>
              <Text style={{fontWeight: 'bold'}}>PHP {loadInfo.amount}.00</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text>Payment Method</Text>
              <Text style={{fontWeight: 'bold'}}>ThumbzUpp</Text>
            </View>
          </View>
          <View style={{paddingHorizontal: '15%', paddingVertical: 20}}>
            <Text style={{textAlign: 'center', color: '#777777', fontSize: 13}}>{moment().format('DD MMMM YYYY hh:mm A')}</Text>
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
    // color: '#880ED4'
    color: 'white'
  },
  header: {
    backgroundColor: '#880ED4'
  },
  headerText : {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default memo(LoadPayed);
