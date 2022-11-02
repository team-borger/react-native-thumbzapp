import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { MaskedTextInput} from "react-native-mask-text";
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import TextInput from '../components/TextInput';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addAddressAPI, updateAddressAPI, setAddressDefaultAPI } from '../services/address';

type Props = {
  navigation: Navigation;
};

const AddCard = ({ navigation }: Props) => {
  const [form, setForm] = useState({default: false});
  const [loading, setLoading] = useState(false);

  const addSuccess = res => {
    setLoading(false)
    const { data } = res.data;
    AsyncStorage.setItem('choosenAddress', JSON.stringify({}))
    navigation.replace('MyAddressCheckout')
  }

  const addError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      Alert.alert('Add Address Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Add Address Error', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const _goBack = () => {
    AsyncStorage.setItem('choosenAddress', JSON.stringify({}))
    navigation.navigate('MyAddressCheckout');
  }

  const _saveAddress = () => {
    setLoading(true)
    addAddressAPI(form,addSuccess,addError);
  }

  const _updateAddress = () => {
    setLoading(true)
    updateAddressAPI(form,addSuccess,addError);
  }

  const makeDefault = (payload) => {
    setAddressDefaultAPI(payload, addSuccess, addError)
  }

  const setChoosen = async () => {
    try {
      const value = await AsyncStorage.getItem('choosenAddress')
      if (value !== null || value !== {}) {
        const ret = JSON.parse(value)
        setForm(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setChoosen()
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>{form.id ? 'Update' : 'Add'} Address</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.carddetails}>
          <View style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Address Details</Text>
          </View>

          <TextInput
            placeholder="Full Name"
            returnKeyType="next"
            value={form.name}
            onChangeText={text => setForm((prevState) => ({...prevState, name: text,}))}
          />

          <TextInput
            placeholder="Mobile Number"
            returnKeyType="next"
            value={form.phone}
            onChangeText={text => setForm((prevState) => ({...prevState, phone: text,}))}
          />

          <TextInput
            placeholder="Address"
            returnKeyType="next"
            value={form.address}
            onChangeText={text => setForm((prevState) => ({...prevState, address: text,}))}
          />

        </View>

        <View style={form.default === false && form.id ? { paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 20 } : {display: 'none'}}>
          <Button mode="outlined" onPress={() => makeDefault(form.id)}>
            Set as Default
          </Button>
        </View>

      </View>
      <Button style={styles.logoutBtn} mode="contained" onPress={form.id ? _updateAddress : _saveAddress }>
        {loading ? 'Loading...' : form.id ? 'Update Address' :'Save Address'}
      </Button>
    </SafeAreaView>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  carddetails: {
    paddingTop: 10,
    paddingBottom: 10
  },
  reminder: {
    backgroundColor: '#e6fff3',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 0,
    height: '100%',
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 10
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
    backgroundColor: 'white'
  }
});
