import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import CartItem from './CartItem';
import { useIsFocused } from '@react-navigation/native'

const MyComponent = () => {
  useIsFocused()

  const products = [
    { product_id: 1, name: 'ice tubig', quantity: 5 },
    { product_id: 2, name: 'Coco crunch', quantity: 2 },
    { product_id: 3, name: 'ispeP', quantity: 3 },
    { product_id: 4, name: 'Short bond paper', quantity: 5 },
    { product_id: 5, name: 'M4A1', quantity: 1 },
  ];

  const [cartItems, setCartItems] = useState(products);
  const [toBeDeletedItems, setToBeDeletedItems] = useState([])
  const [listItemsRefresh, setListItemsRefresh] = useState(false)

  const addClicked = (index) => {
    let tempCart = cartItems;
    tempCart[index].quantity++;
    setCartItems(tempCart);
    console.log('qty-parent', cartItems[index].quantity);
  };

  const minusClicked = (index) => {
    let tempCart = cartItems;
    tempCart[index].quantity--;

    if (tempCart[index].quantity < 1) {
      removeItem(index);
      setTimeout(()=>{
        setListItemsRefresh(!listItemsRefresh)
      }, 290)
    } else {
      setCartItems(tempCart);
      console.log('qty-parent', cartItems[index].quantity);
    }
    console.log(123, cartItems);
  };

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
    })
    removeCartItem()

    setCartItems(tempCart)
    setToBeDeletedItems([])
    console.log(cartItems)
  }

  const removeCartItem = () => {

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
              addClicked={addClicked}
              minusClicked={minusClicked}
              itemSelected={itemSelected}
              removed={toBeDeletedItems}
            />
        )}
        keyExtractor={(item) => item.product_id}
        extraData={listItemsRefresh}
      />
    )
  }

  return (
    <View style={{ margin: 10 }}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <IconButton color='black' icon="delete" onPress={() => {bulkDelete()}} />
        <IconButton color='black' icon="refresh" onPress={() => {setCartItems(products)}} />
      </View>
      <Cart />
    </View>
  );
};

export default MyComponent;
