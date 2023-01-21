import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Image, Alert } from 'react-native';
import { Text, TouchableRipple, Button, IconButton, RadioButton } from 'react-native-paper';
import { updateCartAPI, deleteCartAPI } from '../../services/products';
import environment from '../../../environment';
import NumericInput from 'react-native-numeric-input'

const CartItem = (props) => {

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideDownAnim = useRef(new Animated.Value(0)).current;

  const [cartItemActive, setCartItemActive] = useState(false);

  const [quantity, setQuantity] = useState(props.item.quantity)
  const [subTotal, setSubTotal] = useState(0)
  const [description, setDescription] = useState(props.item.product.description)
  const [checked, setCheckedStatus] = useState(false)

  useEffect(() => {
    if(quantity != 0) {
      setSubTotal( formatNumber(quantity * props.item.product.price) )
      props.quantityChanged({ product_id: props.item.product_id, value: quantity })

      _updateCartItem()
    }
  })

  const widthInterpolate = fadeAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  const heightInterpolate = slideDownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [70, 118],
  });


  const redAnimatedStyle = {
    width: widthInterpolate,
  };

  const belowAnimatedStyle = {
    width: widthInterpolate,
    height: heightInterpolate
  };

  const longPressed = () => {
    Animated.timing(slideDownAnim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 300,
    }).start();
    setCartItemActive(true)
  };

  const deleteCanceled = () => {
    Animated.timing(slideDownAnim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 300,
    }).start();

    setCartItemActive(false)
  }

  const deleteItem = () => {
    Animated.timing(fadeAnim2, {
      toValue: 1,
      useNativeDriver: false,
      duration: 300,
    }).start();
  }

  const itemSelected = () => {
    setCheckedStatus(!checked)
    props.itemSelected(props.item.product_id, !checked)
  }

  const confirmDelete = () => {
    Alert.alert('Remove confirmation', `"${props.item.product.name}" will be removed from your cart, proceed?`, [
      {
        text: 'Yes, remove from cart',
        onPress: () => {
          deleteItem()
          props.quantityChanged({ product_id: props.item.product_id, value: 0 })
          _deleteCartItem()
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          setQuantity(1)
        },
        style: 'cancel',
      },
    ])
  }

  const _updateCartItem = () => {
    const payload =
      {
        id: props.item.id,
        user_id: props.item.user_id,
        product_id: props.item.product_id,
        quantity: quantity > 0 ? quantity : 1,
        status: 'pending',
      }
    updateCartAPI(payload, null, _requestFail)
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

  const _deleteCartItem = () => {
    deleteCartAPI(props.item.id, null, _requestFail)
  }

  function Cancel() {
    return (
      <Button icon="" mode="text" onPress={() => deleteCanceled()}>
        Close
      </Button>
    )
  }

// additionals beding =========================================================================================

const formatNumber = (inputNumber) => {
  let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return(formetedNumber);
}

// additionals end =============================================================================================

// {flexDirection: 'row', alignItems: 'space-between'}
    return (
    <View style={{marginBottom: 0, borderBottomColor: '#eeeeee', borderBottomWidth: 2}}>
      <Animated.View style={[redAnimatedStyle, {position: 'absolute', zIndex: 1}]}>
        <TouchableRipple
          style={styles.red}
          onPress={() => console.log('Pressed', cartItemActive)}
          onLongPress={() => longPressed()}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.base}>

            <View style={{width: '10%'}}>
              <RadioButton
                status={ checked ? 'checked' : 'unchecked' }
                onPress={() => itemSelected()}
              />
            </View>

            <View style={{width: '65%'}}>
              <View style={styles.alignCenterRow}>
                <Image source={{ uri: `${environment.APP_URL}/storage/uploads/products/${props.item.product.id}/${props.item.product.images[0].photo}` }} style={styles.image} />
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>{props.item.product.name}</Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} { formatNumber(props.item.product.price) }</Text>
                    <Text style={{color: 'gray', fontSize: 12}}> X {quantity}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%'}}>
              <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} { subTotal }</Text>
            </View>

          </View>
        </TouchableRipple>
      </Animated.View>
      <Animated.View style={belowAnimatedStyle}>
        <TouchableRipple
          style={[styles.below, { alignItems: 'flex-end', justifyContent: 'flex-end' }]}
          onPress={() => console.log('Pressed')}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.iconContainer}>
            <Cancel />
            <View style={{flexDirection: 'row', justifyContent: 'center', paddingRight: 15}}>
              <NumericInput
                value={quantity}
                onChange={value => { value > 0 ? setQuantity(value) : confirmDelete() }}
                editable={false}
                totalHeight={30}
                iconSize={25}
                minValue={0}
                maxValue={ Number(props.item.product.quantity) }
                extraTextInputProps={'dynamicMutate'}
              />
            </View>
          </View>
        </TouchableRipple>
      </Animated.View>
    </View>
  );
}

// <View>
//   <Button style={{flex: 1}}>
//     <Text>{ `${description} : ${quantity} x subtotal` }</Text>
//   </Button>
//   <View style={styles.iconContainer}>
//     { cartItemActive && <Cancel /> }
//   </View>
// </View>

// <IconButton color='black' icon="minus-thick" onPress={() => minusClicked()} />
// <IconButton color='black' icon="plus-thick" onPress={() => addClicked()} />


const styles = StyleSheet.create({
  red: {
    backgroundColor: '#F5FCFF',
    // backgroundColor: 'red',
    // height: 50,
  },
  base: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems:'center'
  },
  below: {
    // backgroundColor: 'pink',
    height: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    height: 40
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});

export default CartItem;
