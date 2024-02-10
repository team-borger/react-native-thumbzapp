import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, ToggleButton, RadioButton } from 'react-native-paper';
import { Navigation } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../../components/NavbarBot';
import QuantitySelector from '../../components/QuantitySelector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartModule from '../../components/Cart/CartModule';
import { cartFoodAllAPI } from '../../services/food';
import environment from '../../../environment';
import { useIsFocused} from '@react-navigation/native';
import { updateFoodCartAPI, deleteFoodCartAPI } from '../../services/food';

type Props = {
  navigation: Navigation;
};

const CartFood = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)
  const [items, setItems] = useState([])
  const [loginuser, setUser] = useState({})
  const [selected, setSelected] = useState([])
  const [showButton, setShowButton] = useState(false)
  const [listItemsRefresh, setListItemsRefresh] = useState(false)
  const [bulkDeleteTrigger, setBulkDeleteTrigger] = useState(0)

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
  }

  const totalSelected = () => {
    var totalValue = 0
    for (let item of selected) {
      totalValue = totalValue + (item.quantity * item.food.price)
    }
    return formatNumber(totalValue)
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen');
  }

  const _goToChats = () => {
    navigation.navigate('Dashboard');
  }

  const _bulkDeleteTrigger = () => {
    setBulkDeleteTrigger( bulkDeleteTrigger + 1 )
  }

  const _onCheckoutPressed = () => {
    AsyncStorage.setItem('checkoutFood', JSON.stringify(selected))
    AsyncStorage.setItem('paymentMethod', JSON.stringify({}))
    navigation.navigate('CheckoutFoodScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      _getUserInfo()
      setSelected([])
      AsyncStorage.setItem('choosenAddress', JSON.stringify({}))
    }, [navigation])
  );

  const _getUserInfo = async () => {
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

  const formatNumber = (inputNumber) => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return(formetedNumber);
  }

  const _updateCartItem = (x) => {
    const payload =
      {
        id: x.item.id,
        user_id: x.item.user_id,
        product_id: x.item.food_id,
        quantity: x.value,
        status: 'pending',
      }
    changeQuantity(x.value, payload)
    setListItemsRefresh(!listItemsRefresh)
    updateFoodCartAPI(payload, null, _requestFail)
  }

  const _deleteCartItem = (x) => {
    deleteFoodCartAPI(x.item.id, null, _requestFail)
    _getUserInfo()
  }

  const _requestFail = err => {
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

  const confirmDelete = (x) => {
    Alert.alert('Remove confirmation', `"${x.item.food.name}" will be removed from your cart, proceed?`, [
      {
        text: 'Yes, remove from cart',
        onPress: () => {
          _deleteCartItem(x)
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ])
  }

  const valueChanged = (x) => {
     if (x.value > 0) {
       _updateCartItem(x)
     } else {
       confirmDelete(x)
     }
  }

  useIsFocused();

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Cart</Text>}/>
        <Appbar.Action icon="delete" color="#880ED4" onPress={ _bulkDeleteTrigger } />
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
                <View style={{width: '90%'}}>
                  <View style={styles.alignCenterRow}>
                    <Image source={{ uri: `${environment.APP_URL}/storage/uploads/foods/${item.food.id}/${item.food.images[0].photo}` }} style={styles.image} />
                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: 'bold'}}>{item.food.name}</Text>
                      <View style={{display: 'flex', flexDirection: 'column', marginTop: 3}}>
                        <Text style={{color: '#880ED4', fontSize: 12, marginBottom: 5}}>{'\u20B1'} {formatNumber(item.food.price)}</Text>
                        <QuantitySelector
                          item={item}
                    			value={item.quantity}
                          valueChanged={valueChanged}
                    			minQuantity={0}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            extraData={listItemsRefresh}
          />
        </View>
        {
        // <CartModule cartItems={ items } bulkDeleteTrigger={bulkDeleteTrigger}/>
        }
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
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
    borderColor: 'red'
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

export default memo(CartFood);
