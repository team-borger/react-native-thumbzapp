import React, { memo, useState, useEffect }  from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const QuantitySelector = (props) => {

  const [minQuantity, setMinQuantity] = useState(0);
  const [baseColor, setBaseColor] = useState('#6a0ba7');
  const [quantity, setQuantity] = useState(props.value);

  const _onIncreaseQuantity = () => {
    if (props.maxQuantity === undefined || quantity < props.maxQuantity) {
      props.valueChanged({ item: props.item, value: quantity + 1 })
      setQuantity(quantity + 1)
    }

  }

  const _onDecreaseQuantity = () => {
    if (minQuantity === undefined || quantity > minQuantity) {
      props.valueChanged({ item: props.item, value: quantity - 1 })
      setQuantity(quantity - 1)
    }
  }

  return (
    <View style={[ styles.container, props.style ]}>
      <Icon.Button
        size={ 30 }
        backgroundColor='transparent'
        color={ baseColor }
        underlayColor='transparent'
        style={ styles.actionButton }
        iconStyle={ styles.icon }
        onPressIn={() => {_onDecreaseQuantity()}}
        name='remove-circle-outline' />
      <TextInput
        underlineColorAndroid={ baseColor }
        keyboardType='numeric'
        style={[ styles.quantityInput, { color: baseColor }]}
        editable={ false }
        value={quantity.toString()}
        />
      <Icon.Button
        size={ 30 }
        color={ baseColor }
        backgroundColor='transparent'
        underlayColor='transparent'
        style={ styles.actionButton }
        iconStyle={ styles.icon }
        onPressIn={() => {_onIncreaseQuantity()} }
        name='add-circle-outline' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 150,
    marginLeft: 0,
    marginRight: 0,
    padding: 0
  },
  actionButton: {
  },
  icon: {
    marginRight: 0,
    padding: 0,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    height: 45
  }
});

export default QuantitySelector;
