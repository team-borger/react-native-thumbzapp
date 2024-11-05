import React, { memo, useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Card, Title, Paragraph, Avatar, Button, Banner } from 'react-native-paper';
import { Navigation } from '../../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import netprovider from '../../strings/network-providers'
import { findNetworkAPI } from '../../services/load';
import environment from '../../../environment';
import { useFocusEffect } from '@react-navigation/native';
import { MaskedTextInput, unMask } from "react-native-mask-text";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const NetLoad = ({ navigation }: Props) => {
  const [phone_number, setPhoneNumber] = useState(0)
  const [isOk, setIsOk] = useState(false)
  const [bannerOn, setBannerOn] = useState(false)
  const [bannerMessage, setBannerMessage] = useState('')

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const fetchSuccess = res => {
    let numberInfo = {
      phone_number: unMask(phone_number)
    }
    let payload = res.data
    payload.numberinfo = numberInfo
    AsyncStorage.setItem('networkInfo', JSON.stringify(payload))
    navigation.replace('LoadProcessScreen')
  }

  const fetchError = err => {
    if (err.response.data.error_message) {
      setBannerMessage(err.response.data.error_message)
      setBannerOn(true)
    } else {
      setBannerMessage('Something went wrong. Please Try again later.')
      setBannerOn(true)
    }
  }

  const numberCheck = () => {
    const body = {
      phone_number: unMask(phone_number)
    }
    findNetworkAPI(body, fetchSuccess, fetchError)
  }

  useEffect(() => {
    if (phone_number) {
      if (unMask(phone_number).length === 11) {
        setBannerOn(false)
        setIsOk(true)
      } else {
        setBannerOn(false)
        setIsOk(false)
      }
    }
  }, [phone_number]);

  useEffect(() => {
    if (bannerOn == true) {
      setBannerOn(true)
    }
  }, [bannerOn]);

  useFocusEffect(
    React.useCallback(() => {

    }, [navigation])
  );

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#880ED4' }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="white"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>Buy Load</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={{margin: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}} keyboardType="numeric">Enter Phone Number</Text>
        </View>
        <View style={{marginHorizontal: 10, marginTop: 10, marginBottom: 5}}>
          <MaskedTextInput
            placeholder="Mobile number"
            mask="9999 999 9999"
            keyboardType="numeric"
            value={phone_number}
            onChangeText={text => setPhoneNumber(text)}
            style={styles.inputPhone}
          />
        </View>
        <Button style={isOk ? styles.logoutBtn : styles.hide} mode="contained"
          onPress={() => {
            numberCheck()
          }}
        >
          Next
        </Button>
        <View style={{padding: 10}}>
          <Banner
            visible={bannerOn}
            actions={[
              {
                label: 'Close',
                onPress: () => setBannerOn(false),
              }
            ]}
            icon={({size}) => (
              <Image
                source={{
                  uri: `https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png`,
                }}
                style={{
                  width: size,
                  height: size,
                }}
              />
            )}>
            {bannerMessage}
          </Banner>
        </View>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  inputPhone: {
    width: '100%',
    height: 57,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 15,
    color: 'black',
    fontSize: 15
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 0
  },
  hide: {
    display: 'none'
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
      paddingHorizontal: 10
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(NetLoad);
