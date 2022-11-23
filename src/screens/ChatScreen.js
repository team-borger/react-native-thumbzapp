import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, KeyboardAvoidingView, View, ScrollView, Text, Button, StyleSheet, Alert } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Appbar } from 'react-native-paper';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadThreadsAPI, createMessageAPI } from '../services/messages';
import { CallService } from '../services';

type Props = {
  navigation: Navigation;
};

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState([]);
  const [loginUser, setLoginUser] = useState({});
  const [chatUser, setChatUser] = useState({});

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
        loadThreadsAPI(ret.contact.id, getChatSuccess, apiError)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  const _goBack = () => {
    navigation.navigate('Dashboard');
  }

  const _handleCall = () => {
    console.log('Calling...')
    Alert.alert('Calling...', 'message',
      [
        {
          text: "Reject",
          onPress: () => console.log("Reject Pressed"),
        },
        {
          text: "Accept",
          onPress: () => console.log("Accept Pressed"),
        },
      ], { cancelable: false }
    );
  };

  const _handlevideoCall = async () => {
    const value = await AsyncStorage.getItem('active_chat')
    const ret = JSON.parse(value);

    CallService.startCall({connectycube_id: ret.contact.connectycube_id})
      .then(response => {
        if(response) {
          navigation.navigate('CallingScreen', {response: response})
          // navigation.navigate('CallScreen', {response: response})
        }
      })
  };

  const getChatSuccess = res => {
    setMessages(res.data.map(item => ({
      _id: item.id,
      createdAt: item.date_created,
      text: item.message,
        user: {
          _id: item.sender_id
      },
    })))
  }

  const createSuccess = res => {
    // console.log('success: ', res.data)
  }

  const apiError = err => {
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

  const _createMessage = async (payload) => {
    const skeks = await AsyncStorage.getItem('active_chat')
    if (skeks !== null) {
      const skek = JSON.parse(skeks);
      const contact = skek.contact
      const body = {
        recepient_id: contact.id,
        content: payload[0].text,
      }
      createMessageAPI(body, createSuccess, apiError)
    }

  }

  const onSend = useCallback((messages = []) => {
    _createMessage(messages)
    setMessages((previousMessages) =>
      GiftedChat.prepend(previousMessages.reverse(), messages),
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#880ED4',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>{chatUser.first_name + ' ' + chatUser.last_name}</Text>} />
        <Appbar.Action icon="phone" onPress={_handleCall} />
        <Appbar.Action icon="video" onPress={_handlevideoCall} />
      </Appbar.Header>
      <GiftedChat
        messages={messages.reverse()}
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
        alwaysShowSend
        user={{
          _id: loginUser.id,
        }}
        renderSend={renderSend}
        scrollToBottom
        renderAvatar={null}
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ground: {
    padding: 20,
    backgroundColor: '#eeeeee',
    height: '100%'
  },
  setColorText: {
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
