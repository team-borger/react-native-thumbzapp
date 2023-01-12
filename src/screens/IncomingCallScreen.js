import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Avatar } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallService } from '../services';
import * as RootNavigation from '../components/RootNavigation';

type Props = {
  navigation: Navigation;
};

const Calling = (response) => {
  const initiator = response.route.params.initiator

  const [loginUser, setLoginUser] = useState({});
  const [chatUser, setChatUser] = useState({});

  const _goBack = () => {
    RootNavigation.navigate('ChatScreen');
  }

  const _rejectCall = () => {
    CallService.rejectCall();
    RootNavigation.navigate('ChatScreen');
  }

  const _answerCall = () => {
    // console.log('res',response)
    CallService.acceptCall();
    // navigation.navigate('CallScreen', {response: response});
  }

  useEffect(() => {
    _getActiveChat()
  }, []);

  const _getActiveChat = async () => {
    try {
      const value = await AsyncStorage.getItem('active_chat')
      const skeks = await AsyncStorage.getItem('user')
      if (skeks !== null) {
        const skek = JSON.parse(skeks);
        setLoginUser(skek)
      }
      if (value !== null) {
        const ret = JSON.parse(value);
        setChatUser(ret.contact)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <Appbar.Header dark={true} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>{ initiator }</Text>
          <Text style={{color: 'white', fontSize: 18}}>is calling...</Text>
        </View>
        <View style={{marginBottom: 100, display: 'flex', alignItems: 'center', flexDirection:"row", justifyContent: 'space-around'}}>
          <TouchableOpacity onPress={_rejectCall}>
            <Avatar.Icon size={50} icon="phone-hangup" style={{backgroundColor:"#ff4a43"}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={_answerCall}>
            <Avatar.Icon size={50} icon="phone" style={{backgroundColor:"#30cc45"}} color="white"/>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#151c2e',
  },
  contentContainer: {
      flex: 1
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

export default memo(Calling);
