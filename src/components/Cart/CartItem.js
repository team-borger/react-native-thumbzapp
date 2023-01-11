import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, TouchableRipple, Button, IconButton, RadioButton } from 'react-native-paper';

const CartItem = (props, { removed }) => {

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideDownAnim = useRef(new Animated.Value(0)).current;

  const [cartItemActive, setCartItemActive] = useState(false);

  const [quantity, setQuantity] = useState(props.item.quantity)
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
    outputRange: [40, 80],
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

    return (
    <View style={{marginBottom: 10}}>
      <Animated.View style={[redAnimatedStyle, {position: 'absolute', zIndex: 1}]}>
        <TouchableRipple
          style={styles.red}
          onPress={() => console.log('Pressed', cartItemActive)}
          onLongPress={() => longPressed()}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
            <RadioButton
              status={ checked ? 'checked' : 'unchecked' }
              onPress={() => itemSelected()}
            />
            <Button style={{flex: 1}}>
              <Text>{ `${props.item.name} : ${quantity}` }</Text>
            </Button>
            <View style={styles.iconContainer}>
              { cartItemActive && <Cancel /> }
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
              <IconButton color='black' icon="minus-thick" onPress={() => minusClicked()} />
              <IconButton color='black' icon="plus-thick" onPress={() => addClicked()} />
            </View>
          </View>
        </TouchableRipple>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  red: {
    backgroundColor: 'red',
    height: 40,
  },
  below: {
    backgroundColor: 'pink',
    height: '100%',
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40
  }
});

export default CartItem;
