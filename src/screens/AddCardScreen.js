import React, { memo } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import TextInput from '../components/TextInput';
import {
  accountNumberValidator,
  cardCvnValidator,
  expiryDateValidator
} from '../core/utils';

type Props = {
  navigation: Navigation;
};

const ChatScreen = ({ navigation }: Props) => {
  const [account_number, setAccountNumber] = useState({ value: '', error: '' });
  const [card_cvn, setCardCvn] = useState({ value: '', error: '' });
  const [expiry_date, setExpiryDate] = useState({ value: '', error: '' });
  const [exp_month, setExpiryMonth] = useState({ value: '', error: '' });
  const [exp_year, setExpiryYear] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);

  const addCardSuccess = res => {
    setLoading(false)
    const { data } = res.data;
    navigation.replace('PaymentMethodList')
  }

  const addCardError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      Alert.alert('Add Card Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Add Card Error', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const _goBack = () => {
    navigation.navigate('PaymentMethodList');
  }

  const _saveCard = () => {
    const accountNumberError = accountNumberValidator(account_number.value);
    const cardCvnError = cardCvnValidator(card_cvn.value);
    const expiryDateError = expiryDateValidator(expiry_date.value);

    console.log('Save Card')
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Add Card</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.reminder}>
          <FontAwesome name='shield' size={15} color='#00a556' />
          <View style={{marginLeft: 10}}></View>
          <Text style={{color: '#00a556', fontWeight: 'bold'}}>Your card details are protected.</Text>
        </View>
        <View style={styles.carddetails}>
          <View style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Card Details</Text>
          </View>

          <TextInput
            placeholder="Card Number"
            returnKeyType="next"
            value={account_number.value}
            onChangeText={text => setAccountNumber({ value: text, error: '' })}
            error={!!account_number.error}
            errorText={account_number.error}
          />

          <TextInput
            placeholder="Expiry Date (MM/YY)"
            returnKeyType="next"
            value={expiry_date.value}
            onChangeText={text => setExpiryDate({ value: text, error: '' })}
            error={!!expiry_date.error}
            errorText={expiry_date.error}
          />

          <TextInput
            placeholder="CVV"
            returnKeyType="next"
            render={props =>
              <TextInputMask
                {...props}
                mask="+[00] [000] [000] [000]"
              />
            }
            value={card_cvn.value}
            onChangeText={text => setCardCvn({ value: text, error: '' })}
            error={!!card_cvn.error}
            errorText={card_cvn.error}
          />

        </View>
      </View>
      <Button style={styles.logoutBtn} mode="contained" onPress={_saveCard}>
        {loading ? 'Loading...' : 'Save Card'}
      </Button>
    </View>
  );
};

export default ChatScreen;

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
    backgroundColor: 'transparent'
  }
});
