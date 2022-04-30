import React, {useState, useEffect, useCallback} from 'react';
import {Platform, KeyboardAvoidingView, View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Appbar } from 'react-native-paper';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const ChatScreen = ({ navigation }: Props) => {
  const _goBack = () => {
    navigation.navigate('Dashboard');
  }

  const _handleCall = () => console.log('Calling...');

  const _handlevideoCall = () => console.log('Video Calling...');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
         _id: 1,
         text: 'Hello developer',
         createdAt: new Date(),
         user: {
           _id: 2,
           name: 'React Native',
           avatar: 'https://placeimg.com/140/140/any',
         },
       },
    ]);
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
    <View style={{ flex: 1 }}>
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
       {
          Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
       }
    </View>
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
