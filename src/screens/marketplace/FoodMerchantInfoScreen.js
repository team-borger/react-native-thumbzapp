import React, { memo,useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Searchbar, Card, Title, Paragraph, Avatar, Badge } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { cartFoodAllAPI } from '../../services/food';
import { merchantFoodListAPI } from '../../services/users';
import { foodSearchAPI } from '../../services/food';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import environment from '../../../environment';

type Props = {
  navigation: Navigation;
};

const FoodMerchant = ({ navigation }: Props) => {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [foodList, setFoodList] = useState([])
  const [count, setCount] = useState(0);
  const [loginuser, setUser] = useState({});
  const [merchantInfo, setMerchant] = useState({});

  const _goToCart = () => {
    navigation.navigate('CartFoodScreen')
  }

  const _goBack = () => {
    navigation.navigate('FoodScreen')
  }

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  const fetchSuccess = res => {
    setProducts(res.data.data)
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
      merchant_type: 'Food',
      take: 100,
      skip: 0
    }
    setTimeout(() => {
      merchantFoodListAPI(body, fetchSuccess, fetchError)
    }, 1000)
  }

  const selectProduct = (payload) => {
    AsyncStorage.setItem('choosenFoodMerchant', JSON.stringify(payload))
    navigation.replace('FoodInfoScreen')
  }

  useFocusEffect(
    React.useCallback(() => {
      onChangeSearch('')
      _geUserInfo()
      _geMerchantInfo()
    }, [navigation])
  );

  const _getCartInfo = (payload) => {
    let body = payload.id
    cartFoodAllAPI(body, cartAllSuccess, fetchError)
  }

  const _getFoodList = (payload) => {
    let body = {
      merchant_id: payload.id,
      skip: 0,
      take: 100
    }
    foodSearchAPI(body, foodSearchSuccess, fetchError)
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

  const _geMerchantInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('choosenFoodMerchant')
      if (value !== null) {
        const ret = JSON.parse(value);
        setMerchant(ret)
        _getFoodList(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const cartAllSuccess = res => {
    setCount(res.data.length)
  }

  const foodSearchSuccess = res => {
    setFoodList(res.data.data)
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
          <Text style={styles.headerText}>{ merchantInfo.shop_name }</Text>
        </View>
        <View>
          <TouchableHighlight onPress={_goToCart} underlayColor="#eeeeee" style={{ marginRight: 5 }}>
            <MaterialCommunityIcons
              name="basket"
              size={25}
              color="#880ED4"
            />
          </TouchableHighlight>
          <View>
            <TouchableHighlight onPress={_goToCart} underlayColor="#eeeeee" style={{ position: 'absolute', top: -30, right: -5 }}>
              <Badge  style={count === 0 ? {display:'none'} : {} }>{ count }</Badge>
            </TouchableHighlight>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Searchbar
          placeholder="Search"
          style={foodList.length > 0 ? {marginBottom: 20} : {}}
          onChangeText={onChangeSearch}
          value={search}
        />
        <FlatList
          data={foodList}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.skeks}>
              <View style={styles.item}>
                <TouchableHighlight underlayColor="#eeeeee" style={styles.cardStyle} key={item.id} onPress={() => selectProduct(item)}>
                  <Card>
                    <Card.Cover style={styles.yawa} source={{ uri: `${environment.APP_URL}/storage/uploads/foods/${item.id}/${item.images[0].photo}` }} />
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
      </View>


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

export default memo(FoodMerchant);
