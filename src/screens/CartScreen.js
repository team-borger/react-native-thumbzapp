import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton, RadioButton } from 'react-native-paper';
import { Navigation } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartAllAPI } from '../services/products';
import environment from '../../environment';
import { useIsFocused} from '@react-navigation/native';

type Props = {
  navigation: Navigation;
};

const Cart = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)
  const [items, setItems] = useState([])
  const [loginuser, setUser] = useState({})
  const [selected, setSelected] = useState([])
  const [showButton, setShowButton] = useState(false)
  const [listItemsRefresh, setListItemsRefresh] = useState(false)

  const fetchSuccess = res => {
    let arr = []
    for (let item of res.data) {
      item.status = 'unchecked'
      arr.push(item)
    }
    setItems(arr)
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
    // setsubtotal()
  }

  const totalSelected = () => {
    var totalValue = 0
    for (let item of selected) {
      totalValue = totalValue + (item.quantity * item.products[0].price)
    }
    return totalValue
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen');
  }

  const _goToChats = () => {
    navigation.navigate('Dashboard');
  }

  const _onCheckoutPressed = () => {
    AsyncStorage.setItem('checkout', JSON.stringify(selected))
    AsyncStorage.setItem('paymentMethod', JSON.stringify({}))
    navigation.navigate('CheckoutScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      _geUserInfo()
      setSelected([])
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
    cartAllAPI(body, fetchSuccess, fetchError)
  }

  var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){
           arr.splice(i,1);
       }
    }
    return arr;
  }

  const setChoice = (payload) => {
    const found = selected.some(el => el.id === payload.id)
    var objIndex = items.findIndex((obj => obj.id == payload.id));
    if (!found) {
      selected.push(payload)
      items[objIndex].status = 'checked'
    } else {
      removeByAttr(selected, 'id', payload.id)
      items[objIndex].status = 'unchecked'
    }
    setItems(items)
    if (selected.length > 0) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
    setListItemsRefresh(!listItemsRefresh)
  }

  useIsFocused();

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
              <TouchableOpacity key={item.id} onPress={() => {setChoice(item)}} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderBottomColor: '#eeeeee',  borderBottomWidth: 2, width: '100%', flexDirection: 'row', alignItems:'center'}}>
                <View style={{width: '10%'}}>
                  <RadioButton
                    status={item.status}
                    onPress={() => {setChoice(item)}}
                  />
                </View>
                <View style={{width: '65%'}}>
                  <View style={styles.alignCenterRow}>
                    <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.products[0].id}/${item.products[0].images[0].photo}` }} style={styles.image} />
                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: 'bold'}}>{item.products[0].name}</Text>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {item.products[0].price}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}> X {item.quantity}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%',}}>
                  <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} {item.quantity * item.products[0].price}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            extraData={listItemsRefresh}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row'}}>
        <View style={styles.total}>
          <Text style={{marginLeft: 20}}>SubTotal:</Text>
          <Text style={{fontWeight: 'bold', marginLeft: 10, color: '#880ED4' }}>{'\u20B1'} {totalSelected()}</Text>
        </View>
        <View style={showButton === true ? {} : {display:'none'}}>
          <Button style={styles.btn} mode="contained" onPress={_onCheckoutPressed}>
            Check out
          </Button>
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
    alignItems: 'center',
    height: 47
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
    backgroundColor: 'transparent'
  }
});

export default memo(Cart);
