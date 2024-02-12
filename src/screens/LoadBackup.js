import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import netprovider from '../strings/network-providers'
import { loadListAPI } from '../services/load';
import environment from '../../environment';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  navigation: Navigation;
};

const LoadBackup = ({ navigation }: Props) => {
  const [telcos, setTelcos] = useState([])

  const _goToCart = () => {
    navigation.navigate('CartScreen')
  }

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const selectTelco = (payload) => {
    console.log('aaaa')
  }

  const fetchSuccess = res => {
    console.log(res.data.networks)
    setTelcos(res.data.networks)
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

  const onChangeSearch = () => {
    setTimeout(() => {
      loadListAPI(fetchSuccess, fetchError)
    }, 1000)
  }

  useFocusEffect(
    React.useCallback(() => {
      onChangeSearch()
    }, [navigation])
  );

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

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
          <Text style={styles.headerText}>Buy Load</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={{margin: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>Select Telco</Text>
        </View>
        <View style={{width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {telcos.map((item, index) =>
            <TouchableHighlight key={item.id} onPress={() => selectTelco(item)} style={{width: '25%', padding: 5}} underlayColor="#fff">
              <View style={{padding: 5}}>
                <View style={{borderWidth: 1, borderColor: '#880ED4', borderRadius: 10, padding: 5}}>
                  <Image
                    style={{width: '100%', aspectRatio: 1, resizeMode: 'contain'}}
                    source={{
                      uri: item.images.length > 0 ? `${environment.APP_URL}/storage/uploads/networks/${item.id}/${item.images[0].photo}` : '',
                    }}
                  />
                </View>
                <View style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', padding: 2}}>
                  <Text style={{fontWeight: 'bold', color: '#880ED4'}}>{item.network_name}</Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
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
    height: 100,
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
      padding: 5,
      paddingHorizontal: 20
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

export default memo(LoadBackup);
