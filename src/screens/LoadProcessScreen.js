import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ToastAndroid, Alert, TouchableHighlight, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
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
  const [loadPromo, setLoadPromo] = useState([])
  const [networkInfo, setNetworkInfo] = useState({})
  const [form, setForm] = useState({})
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
        setLoadPromo(ret.loadpromo)
        setForm(ret.numberinfo)
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
            <Text style={{fontWeight: 'bold', fontSize: 15, marginTop: 5}}>{form.phone_number}</Text>
          </View>
        </View>
        <View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('Regular')}} style={ tabNow === 'Regular' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'Regular' ? styles.activeTextTab : styles.notActiveTextTab}>Regular</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => {setTabNow('Promo')}} style={ tabNow === 'Promo' ? styles.activeTab : styles.notActiveTab }>
              <Text style={tabNow === 'Promo' ? styles.activeTextTab : styles.notActiveTextTab}>Promo</Text>
            </TouchableHighlight>
          </View>
          <View style={tabNow === 'Regular' ? {} : {display: 'none'}}>
            <Text>Regular</Text>
          </View>
          <View style={tabNow === 'Promo' ? {} : {display: 'none'}}>
            <Text>Promo</Text>
          </View>
        </View>
      </View>

      <Button icon="cart" style={styles.logoutBtn} mode="contained"
        onPress={() => {
          console.log('true')
        }}
      >
        Next
      </Button>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
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
