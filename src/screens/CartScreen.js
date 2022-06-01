import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { Navigation } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const Cart = ({ navigation }: Props) => {
  const [subTotal, setTotal] = useState(0)
  const [items, setItems] = useState([
    {
      id: 1,
      item: 'Item 1',
      price: 189,
      quantity: 1
    },
    {
      id: 2,
      item: 'Item 2',
      price: 99,
      quantity: 1
    },
    {
      id: 3,
      item: 'Item 3',
      price: 102,
      quantity: 1
    }
  ])

  const changeQuantity = (value, payload) => {
    let index = items.findIndex(el => el.id === payload.id);
    items[index].quantity = value;
    setsubtotal()
  }

  const setsubtotal = () => {
    var totalValue = 0
    for (let item of items) {
      totalValue = totalValue + (item.price * item.quantity)
    }
    setTotal(totalValue)
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen');
  }

  const _goToChats = () => {
    navigation.navigate('Dashboard');
  }

  const _onCheckoutPressed = () => {
    AsyncStorage.setItem('checkout', JSON.stringify(items))
    AsyncStorage.setItem('paymentMethod', JSON.stringify({}))
    navigation.navigate('CheckoutScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      setsubtotal()
    }, [navigation])
  );

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
              <View key={item.id} style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10, borderTopColor: '#eeeeee',  borderTopWidth: 2,}}>
                <View style={styles.alignCenterRow}>
                  <View style={styles.alignCenterRow}>
                    <Image source={IMAGE.DEFAULT_ITEM} style={styles.image} />
                    <View>
                      <Text style={{fontWeight: 'bold'}}>{item.item}</Text>
                      <Text style={{color: '#880ED4', fontSize: 12}}>{'\u20B1'} {item.price}</Text>
                    </View>
                  </View>
                  <View>
                    <NumericInput
                      onChange={(value) => changeQuantity(value, item)}
                      totalHeight={30}
                      iconSize={25}
                      minValue={1}
                      valueType='real'
                    />
                  </View>

                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row'}}>
        <View style={styles.total}>
          <Text style={{marginLeft: 20}}>SubTotal:</Text>
          <Text style={{fontWeight: 'bold', marginLeft: 10, color: '#880ED4' }}>{'\u20B1'} {subTotal}</Text>
        </View>
        <Button style={styles.btn} mode="contained" onPress={_onCheckoutPressed}>
          Check out
        </Button>
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
    alignItems: 'center'
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
