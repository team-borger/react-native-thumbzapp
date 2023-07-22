import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import CartItem from './CartItem';
import { deleteCartAPI } from '../../services/products';
import { useIsFocused } from '@react-navigation/native'

const MyComponent = (props, {bulkDeleteTrigger}) => {
  useIsFocused()

  useEffect(() => {
      setCartItems(props.cartItems)
  })

  useEffect(() => {
    // console.log('props.bulkDeletePressed')
    if(props.bulkDeleteTrigger) {
      confirmDelete()
    }
  }, [props.bulkDeleteTrigger])

  const [cartItems, setCartItems] = useState([]);

  const [selectedItems, setSelectedItems] = useState([])
  const [listItemsRefresh, setListItemsRefresh] = useState(false)


  const deepEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }
  const isObject = (object) => {
    return object != null && typeof object === 'object';
  }


  const removeItem = (i) => {
    let tempCart = cartItems;
    tempCart.splice(i, 1);
    setCartItems(tempCart);
  };

  const itemSelected = (product_id, checked) => {
    let tempCart = selectedItems
    const selected = cartItems.find((item) => item.product_id == product_id)
    if(checked) {
      tempCart.push(selected)
    }
    else {
      let tempIndex = tempCart.findIndex((item) => item.product_id == product_id)
      tempCart.splice(tempIndex, 1);
    }
    setSelectedItems(tempCart)
    console.log(selectedItems)
  }

  const bulkDelete = () => {
    let tempCart = cartItems
    selectedItems.forEach((markedItem) => {
      const tempIndex = tempCart.findIndex((item) => item.product_id == markedItem.product_id)
      tempCart.splice(tempIndex, 1);
      console.log('marked', markedItem.id)
      _deleteCartItem(markedItem.id)
    })

    setCartItems(tempCart)
    setSelectedItems([])
    console.log(cartItems)
  }

  const quantityChanged = (x) => {
    let tempCart = cartItems;
    const tempIndex = tempCart.findIndex((item) => item.product_id == x.product_id)

    // console.log('tempIndex '+tempIndex, x.value)
    tempCart[tempIndex].quantity = x.value;
    // console.log(tempCart[tempIndex].quantity)

    if(tempCart[tempIndex]) {
      if (tempCart[tempIndex].quantity < 1) {
        removeItem(tempIndex);
        setTimeout(()=>{
          setListItemsRefresh(!listItemsRefresh)
        }, 290)
      } else {
        setCartItems(tempCart);
      }
    }
  }

  const confirmDelete = () => {
    console.log(selectedItems.length)
    if(selectedItems.length > 0) {
      Alert.alert('Remove confirmation', `Sected items will be removed, proceed?`, [
        {
          text: 'Remove items',
          onPress: () => {
            bulkDelete()
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ])
    }
    else {
      Alert.alert(`Please select items to remove!`, null, [
        {
          text: 'close',
        },
      ])
    }
  }

  const _deleteCartItem = (id) => {
    deleteCartAPI(id, null, _requestFail)
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

  const exta = () => {
    console.log('cartItems', cartItems)
  }

  const Cart = () => {
    return (
      <FlatList
        data={cartItems}
        renderItem={({ item, index }) => (
          <CartItem
            key={item.product_id}
            item={item}
            index={index}
            quantityChanged={quantityChanged}
            itemSelected={itemSelected}
          />
        )}
        keyExtractor={(item) => item.product_id}
        extraData={listItemsRefresh}
      />
    )
  }

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <IconButton color='black' icon="chat" onPress={() => {exta()}} />
        <IconButton color='black' icon="delete" onPress={() => {confirmDelete()}} />
      </View>
      <Cart />
    </View>
  );
};

export default MyComponent;
