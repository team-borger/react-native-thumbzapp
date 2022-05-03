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
    navigation.navigate('PaymentMethodList');
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={<Text style={styles.setColorText}>Add Card</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Text></Text>
      </View>

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
  contentContainer: {
    flex: 1,
    paddingTop: 0,
    padding: 20,
    height: '100%',
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
