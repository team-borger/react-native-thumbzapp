import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight, Platform, ToastAndroid, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { SliderBox } from "react-native-image-slider-box";

type Props = {
  navigation: Navigation;
};

const ProductInfo = ({ navigation }: Props) => {
  const [product, setProduct] = useState({})
  const [images, setImages] = useState([])

  const showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  useFocusEffect(
    React.useCallback(() => {
      _getProductInfo()
    }, [navigation])
  );

  const _getProductInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('choosenProduct')
      if (value !== null) {
        const ret = JSON.parse(value);
        let photos = []
        for (let item of ret.images) {
          photos.push(`http://202.137.120.41:8089/storage/uploads/products/${ret.id}/${item.photo}`)
        }
        setImages(photos)
        setProduct(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
        <SliderBox
          images={images}
          sliderBoxHeight={300}
          onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
          />
          <View style={{margin: 10}}>
            <Text style={{fontSize: 17}}>{product.name}</Text>
            <Text style={{color: '#880ED4', fontSize: 15, marginTop: 10}}>{'\u20B1'}{product.price}</Text>
          </View>
        </View>
      </View>

      <Button icon="cart" style={styles.logoutBtn} mode="contained" >
        Add to Cart
      </Button>

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
    padding: 10
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

export default memo(ProductInfo);
