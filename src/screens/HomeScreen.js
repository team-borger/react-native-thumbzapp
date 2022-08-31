import React, { memo,useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight, ScrollView, List } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Searchbar, Card, Title, Paragraph, Avatar, Badge } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { productsListAPI, cartAllAPI } from '../services/products';
import { foodSearchAPI, cartFoodAllAPI } from '../services/food';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  navigation: Navigation;
};

const Shop = ({ navigation }: Props) => {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [foods, setFoods] = useState([])
  const [count, setCount] = useState(0);
  const [countFood, setCountFood] = useState(0);
  const [loginuser, setUser] = useState({});

  const _goToCart = () => {
    navigation.navigate('CartScreen')
  }

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  const fetchSuccess = res => {
    setProducts(res.data.data)
  }

  const foodFetchSuccess = res => {
    setFoods(res.data.data)
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

  const onChangeSearch = query => {
    setSearch(query)
    const body = {
      keyword: query,
      take: 7,
      skip: 0
    }
    setTimeout(() => {
      productsListAPI(body, fetchSuccess, fetchError)
      foodSearchAPI(body, foodFetchSuccess, fetchError)
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

  const _getCartInfo = (payload) => {
    let body = payload.id
    cartAllAPI(body, cartAllSuccess, fetchError)
    cartFoodAllAPI(body, cartFoodAllSuccess, fetchError)
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

  const cartFoodAllSuccess = res => {
    setCountFood(res.data.length)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#880ED4' }}>
        <Text style={styles.headerText}>ThumbzUpp</Text>
      </View>

      <View style={{padding: 10, backgroundColor: '#880ED4'}}>
        <Searchbar
          placeholder="Search"
          style={products.length > 0 ? {marginBottom: 5} : {}}
          onChangeText={onChangeSearch}
          value={search}
        />
      </View>

      <View style={styles.mininav}>
        <TouchableHighlight style={styles.navitem} underlayColor="#eeeeee" onPress={() => navigation.navigate('ShoppingScreen')}>
          <Card>
            <Card.Content>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Shopping</Text>
              </View>
              <View>
                <Text style={{fontSize: 12}}>Find everything here</Text>
              </View>

              <View style={{ position: 'absolute', top: -5, right: 0 }}>
                <Badge>{ count }</Badge>
              </View>
            </Card.Content>
          </Card>
        </TouchableHighlight>
        <TouchableHighlight style={styles.navitem} underlayColor="#eeeeee" onPress={() => navigation.navigate('FoodScreen')}>
          <Card>
            <Card.Content>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Food</Text>
              </View>
              <View>
                <Text style={{fontSize: 12}}>Satisfy your cravings</Text>
              </View>

              <View style={{ position: 'absolute', top: -5, right: 0 }}>
                <Badge>{ countFood }</Badge>
              </View>
            </Card.Content>
          </Card>
        </TouchableHighlight>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 5, marginBottom: 10, paddingTop: 5, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#880ED4'}}>Top Products</Text>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => navigation.navigate('ShoppingScreen')}>
              <Text>View All</Text>
            </TouchableHighlight>
          </View>
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              >
              {products.map((item, index) =>
                <TouchableHighlight style={styles.cardStyle} key={item.id} onPress={() => selectProduct(item)}>
                  <Card>
                    <Card.Cover style={styles.yawa} source={{ uri: `http://202.137.120.113:8089/storage/uploads/products/${item.id}/${item.images[0].photo}` }} />
                    <Card.Content>
                      <View style={{marginTop: 5, marginBottom: 20}}>
                        <Text numberOfLines={1}>{ item.name }</Text>
                      </View>
                      <View>
                        <Text>{'\u20B1'} { item.price }</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableHighlight>
              )}
              <TouchableHighlight style={styles.cardStyle} onPress={() => navigation.navigate('ShoppingScreen')}>
                <Card style={{height: 228, backgroundColor: '#ead3f9'}}>
                  <Card.Content>
                    <View style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Text>View All</Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableHighlight>
            </ScrollView>
          </View>
          <View style={{paddingHorizontal: 5, marginBottom: 10, paddingTop: 15, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#880ED4'}}>Favorite Food</Text>
            <TouchableHighlight underlayColor="#eeeeee" onPress={() => navigation.navigate('ShoppingScreen')}>
              <Text>View All</Text>
            </TouchableHighlight>
          </View>
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              >
              {foods.map((item, index) =>
                <TouchableHighlight style={styles.cardStyle} key={item.id} onPress={() => selectProduct(item)}>
                  <Card>
                    <Card.Cover style={styles.yawa} source={{ uri: `http://202.137.120.113:8089/storage/uploads/foods/${item.id}/${item.images[0].photo}` }} />
                    <Card.Content>
                      <View style={{marginTop: 5, marginBottom: 20}}>
                        <Text numberOfLines={1}>{ item.name }</Text>
                      </View>
                      <View>
                        <Text>{'\u20B1'} { item.price }</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableHighlight>
              )}
              <TouchableHighlight style={styles.cardStyle} onPress={() => navigation.navigate('FoodScreen')}>
                <Card style={{height: 228, backgroundColor: '#ead3f9'}}>
                  <Card.Content>
                    <View style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Text>View All</Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </ScrollView>

      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#EEEEEE',
  },
  mininav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 10
  },
  navitem: {
    width: '50%',
    padding: 5
  },
  yawa: {
    height: 150,
  },
  skeks: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  item: {
    width: '100%' // is 50% of container width
  },
  cardStyle: {
    marginHorizontal: 5,
    marginBottom: 10,
    width: 150
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
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(Shop);
