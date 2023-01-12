import React, { memo,useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Searchbar, Card, Title, Paragraph, Avatar, Badge } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { productsListAPI, cartAllAPI } from '../services/products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import environment from '../../environment';
import { IMAGE } from '../constants/Image';

type Props = {
  navigation: Navigation;
};

const Shop = ({ navigation }: Props) => {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [count, setCount] = useState(0);
  const [loginuser, setUser] = useState({});
  const [type, setType] = useState('all');
  const [typeLoad, setTypeLoad] = useState(false);

  const _goToCart = () => {
    navigation.navigate('CartScreen')
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  const fetchSuccess = res => {
    setTypeLoad(false)
    setProducts(res.data.data)
  }

  const fetchError = err => {
    setTypeLoad(false)
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

  const onChangeSearch = query => {
    setProducts([])
    setSearch(query)
    var body = {}
    if (type !== 'all') {
      body = {
        keyword: query,
        take: 100,
        skip: 0,
        type: type
      }
    } else {
      body = {
        keyword: query,
        take: 100,
        skip: 0
      }
    }
    setTimeout(() => {
      productsListAPI(body, fetchSuccess, fetchError)
    }, 1000)
  }

  const selectProduct = (payload) => {
    AsyncStorage.setItem('choosenProduct', JSON.stringify(payload))
    navigation.replace('ProductInfoScreen')
  }

  useFocusEffect(
    React.useCallback(() => {
      onChangeSearch('')
      _geUserInfo()
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      setTypeLoad(true)
      onChangeSearch(search)
    }, [type])
  );

  const _getCartInfo = (payload) => {
    let body = payload.id
    cartAllAPI(body, cartAllSuccess, fetchError)
  }

  const _geUserInfo = async () => {
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

  const cartAllSuccess = res => {
    setCount(res.data.length)
  }

  const formatNumber = (inputNumber) => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return(formetedNumber);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="#333"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>Shopping</Text>
        </View>
        <View>
          <TouchableHighlight onPress={_goToCart} underlayColor="#eeeeee" style={{ marginRight: 5 }}>
            <MaterialCommunityIcons
              name="shopping"
              size={25}
              color="#880ED4"
            />
          </TouchableHighlight>
          <View>
            <TouchableHighlight onPress={_goToCart} underlayColor="#eeeeee" style={{ position: 'absolute', top: -30, right: -5 }}>
              <Badge style={count === 0 ? {display:'none'} : {} }>{ count }</Badge>
            </TouchableHighlight>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={search}
        />
        <View style={{marginVertical: 10}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableHighlight disabled={typeLoad} underlayColor="#eeeeee" onPress={() => {setType('all')}} style={ type === 'all' ? styles.activeTab : styles.notActiveTab }>
              <Text style={type === 'all' ? styles.activeTextTab : styles.notActiveTextTab}>All</Text>
            </TouchableHighlight>
            <TouchableHighlight disabled={typeLoad} underlayColor="#eeeeee" onPress={() => {setType('new')}} style={ type === 'new' ? styles.activeTab : styles.notActiveTab }>
              <Text style={type === 'new' ? styles.activeTextTab : styles.notActiveTextTab}>Brand New</Text>
            </TouchableHighlight>
            <TouchableHighlight disabled={typeLoad} underlayColor="#eeeeee" onPress={() => {setType('old')}} style={ type === 'old' ? styles.activeTab : styles.notActiveTab }>
              <Text style={type === 'old' ? styles.activeTextTab : styles.notActiveTextTab}>Preloved</Text>
            </TouchableHighlight>
          </View>
        </View>
        <FlatList
          data={products}
          style={products.length <= 0 ? {display: 'none'} : {}}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.skeks}>
              <View style={styles.item}>
                <TouchableHighlight underlayColor="#eeeeee" style={styles.cardStyle} key={item.id} onPress={() => selectProduct(item)}>
                  <Card>
                    <Card.Cover style={styles.yawa} source={{ uri: `${environment.APP_URL}/storage/uploads/products/${item.id}/${item.images[0].photo}` }} />
                    <Card.Content>
                      <View style={{marginTop: 5, marginBottom: 20}}>
                        <Text>{ item.name }</Text>
                      </View>
                      <View>
                        <Text>{'\u20B1'} { formatNumber(item.price) }</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableHighlight>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={typeLoad ? {flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.5} : {display: 'none'}}>
          <ActivityIndicator size="large" color="#880ED4" />
        </View>
        <View style={typeLoad === false && products.length <=0 ? {flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.5} : {display: 'none'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: -100}}>
            <Image source={IMAGE.MO_PRODUCT} style={styles.icon_image} />
            <Text>No Products Added</Text>
          </View>
        </View>
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  yawa: {
    height: 150,
  },
  icon_image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  skeks: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  activeTab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#880ED4'
  },
  activeTextTab: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#880ED4'
  },
  notActiveTextTab: {
    textAlign: 'center',
    color: 'gray'
  },
  notActiveTab: {
    flex: 1,
    padding: 10,
  },
  item: {
    width: '100%' // is 50% of container width
  },
  cardStyle: {
    margin: 5
  },
  contentContainer: {
      flex: 1,
      padding: 10
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
  headerText : {
    color: '#880ED4',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent',
    marginTop: 0
  }
});

export default memo(Shop);
