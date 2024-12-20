import React, { memo, useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Badge } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, CallService } from '../../services';
import { IMAGE } from '../../constants/Image';
import { userOrdersAPI } from '../../services/products';

type Props = {
  navigation: Navigation;
};

const ProfileScreen = ({ navigation, logout }: Props) => {
  const [loginUser, setLoginUser] = useState({});
  const [toPay, setToPay] = useState(0);
  const [toShip, setToShip] = useState(0);
  const [toReceive, setToReceive] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    getLoginUser()
  }, []);

  const _goBack = () => {
    navigation.navigate('AuthRouteLanding');
  }

  const _onLogoutPressed = async () => {
    try {
      AuthService.logout()
      await AsyncStorage.clear();
      logout(true);
      navigation.replace('LoginScreen')
    } catch {
      Alert.alert('Something went wrong. Please try again.',
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const getSuccess = res => {
    var items = res.data
    console.log(res.data)
    const pay = items.filter((obj) => obj.status.status === 'Waiting for Payment').length
    const ship = items.filter((obj) => obj.status.status === 'Paid' || obj.status.status === 'Pending' || obj.status.status === 'Processing' || obj.status.status === 'Packed').length
    const receive = items.filter((obj) => obj.status.status === 'Shipped').length
    const complete = items.filter((obj) => obj.status.status === 'Delivered').length
    setToPay(pay)
    setToShip(ship)
    setToReceive(receive)
    setCompleted(complete)
  }

  const getError = err => {
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

  const getLoginUser = async () => {
    try {
      const skeks = await AsyncStorage.getItem('user')
      if (skeks !== null) {
        const skek = JSON.parse(skeks);
        setLoginUser(skek)
        userOrdersAPI(skek.id, getSuccess, getError)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const goToOrders = async (payload) => {
    await AsyncStorage.setItem('ordersStatus', payload)
    navigation.replace('OrdersScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 17, paddingVertical: 15, backgroundColor: '#880ED4' }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="white"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>Profile</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.whiteBg}>
          <Avatar.Icon size={40} icon="account" color="white" style={styles.avatar} />
          <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{loginUser.first_name} {loginUser.last_name}</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          {
            // <View
            //   style={{
            //     borderBottomColor: '#eeeeee',
            //     borderBottomWidth: 4,
            //   }}
            // />
            // <TouchableHighlight onPress={() => navigation.navigate('PaymentMethodList')} underlayColor="#fff">
            //   <View
            //     style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
            //     <View style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
            //       <View style={{width: 30}}>
            //         <FontAwesome name='credit-card' size={15} color='black' />
            //       </View>
            //       <View style={{marginLeft: 5}}>
            //         <Text>Payment Methods</Text>
            //       </View>
            //     </View>
            //     <FontAwesome name='angle-right' size={20} color='black' />
            //   </View>
            // </TouchableHighlight>
          }
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          />
          <TouchableHighlight onPress={() => navigation.navigate('MyAddressScreen')} underlayColor="#fff">
            <View
              style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
              <View style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                <View style={{width: 30}}>
                  <FontAwesome name='map-marker' size={15} color='black' />
                </View>
                <View style={{marginLeft: 5}}>
                  <Text>My Address</Text>
                </View>
              </View>
              <FontAwesome name='angle-right' size={20} color='black' />
            </View>
          </TouchableHighlight>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          />
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TouchableHighlight style={{padding: 15, paddingTop: 20, flex: 1, alignItems: 'center'}} onPress={() => goToOrders('pay')} underlayColor="#fff">
              <View style={{alignItems: 'center'}}>
                <Image source={IMAGE.TO_PAY} style={styles.icon_image} />
                <Text style={{fontSize: 10, marginTop: 10}}>To Pay</Text>
                <View style={{ position: 'absolute', top: 0, right: -5 }}>
                  <Badge style={toPay === 0 ? {display:'none'} : {} }>{toPay}2</Badge>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{padding: 15, paddingTop: 20, flex: 1, alignItems: 'center'}} onPress={() => goToOrders('ship')} underlayColor="#fff">
              <View style={{alignItems: 'center'}}>
                <Image source={IMAGE.TO_SHIP} style={styles.icon_image} />
                <Text style={{fontSize: 10, marginTop: 10}}>To Ship</Text>
                <View style={{ position: 'absolute', top: 0, right: -5 }}>
                  <Badge style={toShip === 0 ? {display:'none'} : {} }>{toShip}</Badge>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{padding: 15, paddingTop: 20, flex: 1, alignItems: 'center'}} onPress={() => goToOrders('receive')} underlayColor="#fff">
              <View style={{alignItems: 'center'}}>
                <Image source={IMAGE.TO_RECEIVE} style={styles.icon_image} />
                <Text style={{fontSize: 10, marginTop: 10}}>To Receive</Text>
                <View style={{ position: 'absolute', top: 0, right: -5 }}>
                  <Badge style={toReceive === 0 ? {display:'none'} : {} }>{toReceive}</Badge>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{padding: 15, paddingTop: 20, flex: 1, alignItems: 'center'}} onPress={() => goToOrders('complete')} underlayColor="#fff">
              <View style={{alignItems: 'center'}}>
                <Image source={IMAGE.COMPLETED} style={styles.icon_image} />
                <Text style={{fontSize: 10, marginTop: 10}}>Completed</Text>
                <View style={{ position: 'absolute', top: 0, right: -5 }}>
                  <Badge style={completed === 0 ? {display:'none'} : {} }>{completed}</Badge>
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          />
          <TouchableHighlight onPress={() => navigation.navigate('OrdersFoodScreen')} underlayColor="#fff">
            <View
              style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
              <View style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                <View style={{width: 30}}>
                  <FontAwesome name='map-marker' size={15} color='black' />
                </View>
                <View style={{marginLeft: 5}}>
                  <Text>Food Orders</Text>
                </View>
              </View>
              <FontAwesome name='angle-right' size={20} color='black' />
            </View>
          </TouchableHighlight>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          />
        </View>
        <Button icon="logout" style={styles.logoutBtn} mode="contained" onPress={_onLogoutPressed}>
          Logout
        </Button>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeks: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileInfo: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  whiteBg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  container: {
      flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    borderRadius: 0
  },
  avatar: {
    backgroundColor: '#880ED4',
    marginTop: 30
  },
  contentContainer: {
      flex: 1,
      paddingTop: 0,
      // padding: 20,
      height: '100%',
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
    height: 20
  },
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10
  },
  icon_image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10
  },
  headerText : {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(ProfileScreen);
