import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IMAGE } from '../constants/Image';
import { useFocusEffect } from '@react-navigation/native';
import { getCardListAPI, deleteCardAPI } from '../services/payment';
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {
  navigation: Navigation;
};

const PaymentMethodList = ({ navigation }: Props) => {
  const [items, setItems] = useState([])
  const [showAlert, setState] = useState(false)
  const [choosenItem, setItem] = useState({})

  const hideAlert = () => {
    setState(false);
  };

  const fetchSuccess = res => {
    setItems(res.data)
    setState(false)
  }

  const deleteSuccess = res => {
    setState(false)
    getCardListAPI(fetchSuccess,fetchError);
    navigation.navigate('PaymentMethodList')
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

  const _deleteConfirm = (payload) => {
    setItem({})
    setItem(payload)
    setState(true);
  }

  const _deleteCard = () => {
    deleteCardAPI(choosenItem, deleteSuccess, fetchError);
  }

  useFocusEffect(
    React.useCallback(() => {
      getCardListAPI(fetchSuccess,fetchError);
    }, [navigation])
  );

  const _goBack = () => {
    navigation.navigate('ProfileScreen');
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Manage Methods</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{flex: 1, padding: 20}}>
          <FlatList
            style={styles.scrollView}
            data={items}
            renderItem={({ item }) => (
              <Card style={styles.customCard} key={item.id}>
                <Card.Content>
                  <View style={styles.alignCenterRow}>
                    <View style={styles.alignCenterRow}>
                      <Image source={IMAGE.ICON_MASTERCARD} style={styles.image} />
                      <View>
                        <Text style={{fontWeight: 'bold'}}>{item.account_number}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>Expires {item.exp_date}</Text>
                      </View>
                    </View>
                    <FontAwesome name='trash' size={20} color='gray' onPress={() => _deleteConfirm(item)} />
                  </View>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Button icon="plus" style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('AddCardListScreen')}>
          Add Card
        </Button>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Are you sure?"
          message="This won't be reverted!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={hideAlert}
          onConfirmPressed={_deleteCard}
        />

      </View>

    </SafeAreaView>
  );
};

export default PaymentMethodList;

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
    margin: 5
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
    backgroundColor: 'transparent',
    marginTop: 0
  }
});
