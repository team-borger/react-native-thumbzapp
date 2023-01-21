import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import CartItem from './CartItem';
import { deleteCartAPI } from '../../services/products';
import { useIsFocused } from '@react-navigation/native'

const MyComponent = (props) => {
  useIsFocused()

  const products = [
    { product_id: 1, name: 'ice tubig', quantity: 5 },
    { product_id: 2, name: 'Coco crunch', quantity: 2 },
    { product_id: 3, name: 'ispeP', quantity: 3 },
    { product_id: 4, name: 'Short bond paper', quantity: 5 },
    { product_id: 5, name: 'M4A1', quantity: 1 },
  ];

  useEffect(() => {
    setCartItems(props.cartItems)
  })

  // const [cartItems, setCartItems] = useState(products);
  const [cartItems, setCartItems] = useState([]);

  const [toBeDeletedItems, setToBeDeletedItems] = useState([])
  const [listItemsRefresh, setListItemsRefresh] = useState(false)

  const removeItem = (i) => {
    let tempCart = cartItems;
    tempCart.splice(i, 1);
    setCartItems(tempCart);
  };

  const itemSelected = (product_id, checked) => {
    let tempCart = toBeDeletedItems
    const selected = cartItems.find((item) => item.product_id == product_id)
    if(checked) {
      tempCart.push(selected)
    }
    else {
      let tempIndex = tempCart.findIndex((item) => item.product_id == product_id)
      tempCart.splice(tempIndex, 1);
    }
    setToBeDeletedItems(tempCart)
    console.log(toBeDeletedItems)
  }

  const bulkDelete = () => {
    let tempCart = cartItems
    toBeDeletedItems.forEach((markedItem) => {
      const tempIndex = tempCart.findIndex((item) => item.product_id == markedItem.product_id)
      tempCart.splice(tempIndex, 1);
      console.log('marked', markedItem.id)
      _deleteCartItem(markedItem.id)
    })

    setCartItems(tempCart)
    setToBeDeletedItems([])
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
    console.log(toBeDeletedItems.length)
    if(toBeDeletedItems.length > 0) {
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
        <IconButton color='black' icon="refresh" onPress={() => {setCartItems(props.cartItems)}} />
      </View>
      <Cart />
    </View>
  );
};

export default MyComponent;
