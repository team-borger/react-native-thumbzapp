import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card, RadioButton } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../../constants/Image';
import { useFocusEffect } from '@react-navigation/native';
import { allAddressAPI } from '../../services/address';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {
  navigation: Navigation;
};

const MyAddressCheckout = ({ navigation, route  }: Props) => {
  const { isFood } = route.params;
  const [items, setItems] = useState([])
  const [choosenItem, setItem] = useState({})
  const [listItemsRefresh, setListItemsRefresh] = useState(false)

  const hideAlert = () => {
    setState(false);
  };

  const fetchSuccess = res => {
    setItems(res.data)
    checkSelected(res.data)
  }

  const checkSelected = async (x) => {
    const address = await AsyncStorage.getItem('choosenAddress')
    if (Object.keys(address).length < 3) {
      var objIndex = x.findIndex((obj => obj.default == true));
      x[objIndex].status = 'checked'
      setItem(x[objIndex])
      setItems(x)
    } else {
      const addressinfo = JSON.parse(address);
      var objIndex = x.findIndex((obj => obj.id == addressinfo.id));
      x[objIndex].status = 'checked'
      setItem(addressinfo)
      setItems(x)
    }
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

  const updateAddress = (payload) => {
    navigation.navigate('AddAddressCheckout')
  }

  useFocusEffect(
    React.useCallback(() => {
      allAddressAPI(fetchSuccess,fetchError);
    }, [navigation])
  );

  const _goBack = () => {
    if(isFood) {
      navigation.navigate('CheckoutFoodScreen');
    }else{
      navigation.navigate('CheckoutScreen');
    }
  }

  const setChoice = (payload) => {
    const found = items.some(el => el.status === 'checked')
    var objIndex = items.findIndex((obj => obj.id == payload.id));

    if (found) {
      var smegs = items.findIndex((obj => obj.status == 'checked'));
      items[smegs].status = 'unchecked'
      items[objIndex].status = 'checked'
      setItem(payload)
    } else {
      items[objIndex].status = 'checked'
    }
    setChoosenAddress(payload)
    setListItemsRefresh(!listItemsRefresh)
  }

  const setChoosenAddress = (payload) => {
    AsyncStorage.setItem('choosenAddress', JSON.stringify(payload))
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>My Address</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{paddingHorizontal: 10, paddingVertical: 5 }}>
          {/* <Text style={{color: '#777777'}}>Address</Text> */}
        </View>
        <View style={{flex: 1, paddingTop: 2}}>
          <FlatList
            style={styles.scrollView}
            data={items}
            renderItem={({ item }) => (
              <Card style={styles.customCard} key={item.id} >
                <Card.Content>
                  <View style={styles.alignCenterRow}>
                    <TouchableHighlight onPress={() => setChoice(item)} underlayColor="transparent" style={{width: '85%'}}>
                      <View style={styles.alignCenterRow}>
                        <View style={{width: '10%'}}>
                          <RadioButton
                            status={item.status}
                            onPress={() => {setChoice(item)}}
                          />
                        </View>
                        <View style={{width: '80%'}}>
                          <Text style={{color: 'gray'}}>{item.name} | {item.phone}</Text>
                          <Text>{item.address}</Text>
                          <View style={item.default === true ? {padding: 3, borderColor: 'red', borderWidth: 1, alignSelf: 'flex-start', marginTop: 5} : {}}>
                            <Text style={{color: 'red', fontSize: 10}}>{item.default === true ? 'Default' : ''}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => updateAddress(item)} underlayColor="transparent">
                      <Text style={{color: 'red', alignSelf: 'center'}}>Edit</Text>
                    </TouchableHighlight>
                  </View>
                </Card.Content>
              </Card>

            )}
            keyExtractor={(item) => item.id}
            extraData={listItemsRefresh}
          />
        </View>
        <Button icon="plus-circle" style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('AddAddressCheckout', { isFood: false })}>
          Add New Address
        </Button>

      </View>

    </SafeAreaView>
  );
};

export default MyAddressCheckout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  customCard: {
    marginLeft: 0,
    marginRight: 0,
    margin: 2
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: '#eeeeee'
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10,
    borderRadius: 0
  },
  ground: {
    padding: 20,
    backgroundColor: '#eeeeee',
    height: '100%'
  },
  setColorText : {
    color: '#880ED4'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  header: {
    backgroundColor: 'white',
    marginTop: 0
  }
});
