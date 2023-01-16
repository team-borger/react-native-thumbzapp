import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Text, TouchableRipple, Button, IconButton, RadioButton } from 'react-native-paper';
import environment from '../../../environment';
import NumericInput from 'react-native-numeric-input'

const CartItem = (props, { removed }) => {

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideDownAnim = useRef(new Animated.Value(0)).current;

  const [cartItemActive, setCartItemActive] = useState(false);

  const [quantity, setQuantity] = useState(props.item.quantity)
  const [description, setDescription] = useState(props.item.product.description)
  const [checked, setCheckedStatus] = useState(false)

  useEffect(() => {
    if(removed) {
      console.log(removed)
    }
  }, [removed])


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

  const addClicked = () => {
    setQuantity(quantity + 1)
    console.log('qty-props:', quantity)
    props.addClicked(props.index)
  }

  const minusClicked = () => {
    if(quantity > 0) {
      setQuantity(quantity - 1)
      if(quantity < 2) {
        deleteItem()
      }
      props.minusClicked(props.index)
    }
  }

  const itemSelected = () => {
    setCheckedStatus(!checked)
    props.itemSelected(props.item.product_id, !checked)
  }

  function Cancel() {
    return (
      <IconButton color='black' icon="close-box" onPress={() => deleteCanceled()} />
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
                    <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {formatNumber(props.item.product.price)}</Text>
                    <Text style={{color: 'gray', fontSize: 12}}> X {props.item.quantity}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 2, paddingVertical: 2, width: '25%'}}>
              <Text style={{color: '#880ED4', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{'\u20B1'} {formatNumber(props.item.quantity * props.item.product.price)}</Text>
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
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              { cartItemActive && <Cancel /> }
              <NumericInput
                onChange={value => {}}
                totalHeight={30}
                iconSize={25}
                minValue={1}
                maxValue={69}
                valueType='real'
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
    // borderBottomColor: '#eeeeee',
    // borderBottomWidth: 2,
    width: '100%',
    // height: '100%',
    flexDirection: 'row',
    alignItems:'center'
  },
  below: {
    // backgroundColor: 'pink',
    height: '100%',
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
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
