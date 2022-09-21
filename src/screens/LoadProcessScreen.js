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

type Props = {
  navigation: Navigation;
};

const LoadProcess = ({ navigation }: Props) => {
  const [loadRegular, setLoadRegular] = useState({})
  const [loadRegularData, setLoadRegularData] = useState([])
  const [loadPromo, setLoadPromo] = useState([])
  const [networkInfo, setNetworkInfo] = useState({})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loadChoice, setLoadChoice] = useState('')
  const [tabNow, setTabNow] = useState('Regular')

  useFocusEffect(
    React.useCallback(() => {
      _getNetworkInfo()
    }, [navigation])
  );

  const _getNetworkInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('networkInfo')
      if (value !== null) {
        const ret = JSON.parse(value);
        _getInfo(ret.provider)
        setLoadRegular(ret.loadregular)
        console.log(ret.loadregular)
        setLoadPromo(ret.loadpromo)
        setPhoneNumber(ret.numberinfo.phone_number)
        let data = JSON.parse(ret.loadregular.data)
        setLoadRegularData(data)
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

  const _goBack = () => {
    navigation.navigate('NetLoadScreen')
  }

  const setRegularChoice = (item) => {
    const payload = {
      load_type: 'Regular',
      amount: item
    }
    setLoadChoice(payload)
  }

  const setPromoChoice = (item) => {
    const payload = {
      load_type: 'Promo',
      promo_id: item.id,
      promo_name: item.product_name,
      amount: item.value
    }
    setLoadChoice(payload)
  }

  const loadCheckout = () => {
    AsyncStorage.setItem('loadCheckout', JSON.stringify(loadChoice))
    navigation.replace('LoadCheckoutScreen')
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
          <Text style={styles.headerText}>Buy Load</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={{marginHorizontal: 20, marginVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 50, aspectRatio: 1, resizeMode: 'contain'}}
            source={{
              uri: networkInfo.images ? networkInfo.images.length > 0 ? `${environment.APP_URL}/storage/uploads/networks/${networkInfo.id}/${networkInfo.images[0].photo}` : '' : '',
            }}
          />
          <View style={{marginLeft: 15}}>
            <Text>{networkInfo.network_name} load for</Text>
            <Text style={{fontWeight: 'bold', fontSize: 15, marginTop: 5}}>{phoneNumber}</Text>
          </View>
        </View>
        <View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('Regular'); setLoadChoice('')}} style={ tabNow === 'Regular' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'Regular' ? styles.activeTextTab : styles.notActiveTextTab}>Regular</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('Promo'); setLoadChoice('')}} style={ tabNow === 'Promo' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'Promo' ? styles.activeTextTab : styles.notActiveTextTab}>Promo</Text>
            </TouchableHighlight>
          </View>
          <View style={tabNow === 'Regular' ? {} : {display: 'none'}}>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' ,padding: '10%'}}>
              {loadRegularData.map((item, index) =>
                <TouchableHighlight key={index} onPress={() => {setRegularChoice(item)}} style={{width: '33%', padding: 5}} underlayColor="#fff">
                  <View style={{padding: 5}}>
                    <View style={ loadChoice.amount === item ? styles.loadActive : styles.loadNotActive }>
                      <Text style={ loadChoice.amount === item ? styles.loadActiveText : styles.loadNotActiveText }>{item}</Text>
                      <Text style={loadChoice.amount === item ? {color: '#fff'} : {}}>PHP</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            </View>
          </View>
          <View style={tabNow === 'Promo' ? {} : {display: 'none'}}>
            <FlatList
              data={loadPromo}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.id} onPress={() => {setPromoChoice(item)}} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderBottomColor: '#eeeeee',  borderBottomWidth: 2, width: '100%', flexDirection: 'row', alignItems:'center'}}>
                  <View style={{width: '20%'}}>
                    <View style={{width: 50, height: 50, borderColor: 'red' ,borderWidth: 1, borderRadius: 50, borderColor: '#d99cff', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: '#880ED4', fontWeight: 'bold'}}>{item.value}</Text>
                      <Text style={{fontSize: 10, color: '#888888', fontWeight: 'bold'}}>PHP</Text>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 5, paddingVertical: 5, width: '70%'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: '#880ED4'}}>{item.product_name}</Text>
                    <Text style={{fontSize: 12, color: '#555555', marginTop: 5}}>{item.product_description}</Text>
                  </View>
                  <View style={{paddingHorizontal: 5, paddingVertical: 5}}>
                    <RadioButton
                      value={item.id}
                      status={ loadChoice.promo_id === item.id ? 'checked' : 'unchecked' }
                      onPress={() => {setPromoChoice(item)}}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
      <View style={loadChoice !== '' ? {} : {display: 'none'}}>
        <Button style={styles.logoutBtn} mode="contained"
          onPress={() => {
            loadCheckout()
          }}
        >
          Next
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
    width: '50%',
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
    width: '50%',
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

export default memo(LoadProcess);
