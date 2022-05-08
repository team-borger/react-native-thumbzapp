import React, {useState, useEffect, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Platform, KeyboardAvoidingView, View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Appbar } from 'react-native-paper';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadThreadsAPI } from '../services/messages';

type Props = {
  navigation: Navigation;
};

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState([]);

  const _goBack = () => {
    navigation.navigate('Dashboard');
  }

  const _handleCall = () => console.log('Calling...');

  const _handlevideoCall = () => console.log('Video Calling...');

  const getChatsSuccess = (res) => {
    console.log('aaaa: ', res.data)
    setMessages(res.data)
  }

  const getChatsError = err => {
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

  const _getActiveChat = async () => {
    const jsonValue = await AsyncStorage.getItem('active_chat')
    const result = jsonValue != null ? JSON.parse(jsonValue) : null

    if (result) {
      const body = result
      loadThreadsAPI(body, getChatsSuccess, getChatsError)
    }
  }

  useEffect(() => {
    _getActiveChat()
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
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
            backgroundColor: '#2e64e5',
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
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Princess Garde</Text>}/>
        <Appbar.Action icon="phone" onPress={_handleCall} />
        <Appbar.Action icon="video" onPress={_handlevideoCall} />
      </Appbar.Header>
       <GiftedChat
         messages={messages}
         onSend={(messages) => onSend(messages)}
         user={{
           _id: 1,
         }}
         renderBubble={renderBubble}
         alwaysShowSend
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
