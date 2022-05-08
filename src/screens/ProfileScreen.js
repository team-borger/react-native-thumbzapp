import React, { memo } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, List, Avatar, Searchbar, Appbar } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {

  _onLogoutPressed = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('LoginScreen')
    } catch {
      Alert.alert('Something went wrong. Please try again.',
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}> </Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.whiteBg}>
          <Avatar.Icon size={40} icon="account" color="white" style={styles.avatar} />
          <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Princess Garde</Text>
            <View style={styles.skeks}>
              <FontAwesome name='circle' size={10} color='green' />
              <View style={{marginLeft: 2}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>Online</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <TouchableHighlight onPress={() => navigation.navigate('PaymentMethodList')}>
            <View
              style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
              <View style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                <FontAwesome name='credit-card' size={15} color='black' />
                <View style={{marginLeft: 5}}>
                  <Text>Payment Methods</Text>
                </View>
              </View>
              <FontAwesome name='angle-right' size={20} color='black' />
            </View>
          </TouchableHighlight>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          />
        </View>
        <Button icon="logout" style={styles.logoutBtn} mode="contained" onPress={_onLogoutPressed}>
          Logout
        </Button>
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeks: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileInfo: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  whiteBg: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 0,
    padding: 20
  },
  container: {
      flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
  },
  avatar: {
    backgroundColor: '#880ED4',
    marginTop: 30
  },
  contentContainer: {
      flex: 1,
      paddingTop: 0,
      // padding: 20,
      height: '100%',
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
    height: 20
  },
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10
  }
});

export default memo(Dashboard);
