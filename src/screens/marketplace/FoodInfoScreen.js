import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ToastAndroid, Alert, TouchableHighlight } from 'react-native';
import { Appbar, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QuantitySelector from '../../components/QuantitySelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { SliderBox } from "react-native-image-slider-box";
import BottomSheet from "react-native-easy-bottomsheet";
import { addCartFoodAPI, cartFoodAllAPI } from '../../services/food';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import environment from '../../../environment';
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {
  navigation: Navigation;
};

const FoodInfo = ({ navigation }: Props) => {
  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])
  const [isVisible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loginuser, setUser] = useState({});
  const [count, setCount] = useState(0);
  const [showAlert, setState] = useState(false)

  const showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  useFocusEffect(
    React.useCallback(() => {
      _getProductInfo()
      _geUserInfo()
    }, [navigation])
  );

  const hideAlert = () => {
    setState(false);
  };

  const valueChanged = (x) => {
     setQuantity(x.value)
  }

  const _getCartInfo = (payload) => {
    let body = payload.id
    cartFoodAllAPI(body, fetchSuccess, fetchError)
  }

  const fetchSuccess = res => {
    setCount(res.data.length)
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

  const checkCount = () => {
    if (count > 0) {
      return {display: 'flex'}
    } else {
      return {display: 'none'}
    }
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

  const _getProductInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('choosenFoodMerchant')
      if (value !== null) {
        const ret = JSON.parse(value);
        let photos = []
        for (let item of ret.images) {
          photos.push(`${environment.APP_URL}/storage/uploads/foods/${ret.id}/${item.photo}`)
        }
        setImages(photos)
        setProduct(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const addCart = () => {
    let body = {
      quantity: quantity,
      food_id: product.id,
      user_id: loginuser.id
    }
    addCartFoodAPI(body, addSuccess, addError)
  }

  const addSuccess = res => {
    cartFoodAllAPI(loginuser.id,fetchSuccess, fetchError)
    setVisible(false);
    setState(true);
  }

  const addError = err => {
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

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const _goToCart = () => {
    navigation.navigate('CartFoodScreen')
  }

  const formatNumber = (inputNumber) => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return(formetedNumber);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
        <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
          <MaterialCommunityIcons
            name="arrow-left"
            size={25}
            color="#333"
          />
        </TouchableHighlight>
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
              <Badge style={count === 0 ? {display:'none'} : {} }>{ count }</Badge>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
        <SliderBox
          images={images}
          sliderBoxHeight={300}
          onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
          />
          <View style={{margin: 10}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>{product.name}</Text>
            <Text style={{fontSize: 12}}>{product.description}</Text>
            <Text style={{color: '#880ED4', fontSize: 15, marginTop: 10}}>{'\u20B1'}{formatNumber(product.price)}</Text>
          </View>
        </View>
      </View>

      <BottomSheet
        bottomSheetIconColor="#0A2463"
        bottomSheetStyle={{
          backgroundColor: "white",
          maxHeight: "70%",
          minHeight: "30%",
        }}
        bottomSheetTitleStyle={{color: '#0A2463'}}
        setBottomSheetVisible={setVisible}
        bottomSheetVisible={isVisible}
      >
        <View style={{marginBottom: 5, paddingHorizontal: 20, paddingVertical: 10}}>
          <View style={styles.alignCenterRow}>
            <View style={styles.alignCenterRow}>
              <View>
                <Text style={{fontWeight: 'bold'}}>Quantity</Text>
              </View>
            </View>
            <View>
              <QuantitySelector
                item={product}
                value={1}
                valueChanged={valueChanged}
                minQuantity={1}
              />
            </View>
          </View>
          <View style={{marginTop: 50}}>
            <Button style={styles.btn} icon="basket" mode="contained" onPress={addCart}>
              Add to Basket
            </Button>
          </View>
        </View>
      </BottomSheet>

      <Button icon="basket" style={styles.logoutBtn} mode="contained"
        onPress={() => {
          setVisible(true);
        }}
      >
        Add to Basket
      </Button>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title=""
        message="Added to Basket Successfully!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#880ED4"
        onConfirmPressed={hideAlert}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10,
    borderRadius: 0
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10
  },
  total: {
    flex: 1,
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'center'
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
    padding: 5,
    borderRadius: 0
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
    backgroundColor: 'transparent',
    marginTop: 0
  }
});

export default memo(FoodInfo);
