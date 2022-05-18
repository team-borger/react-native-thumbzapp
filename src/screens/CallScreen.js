import React from 'react';
import { StyleSheet, View, Button, Text, TextInput,Dimensions } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RTCView } from 'react-native-connectycube';

const CallScreen = (response) => {

  const RTCViews = () => {
    const res = response.route.params;
    if(res.localKey) {
      return (
        <View style={styles.blackView}>
          <RTCView style={styles.localKey} key={res.localKey} streamURL={res.localStream.toURL()} />
          <RTCView style={styles.remoteKey} objectFit="cover" key={res.remoteKey} streamURL={res.remoteStream.toURL()} />
        </View>
      );
    }
    else {
      return (
        <View style={styles.blackView}>
          <RTCView style={styles.localKey} key={res.response.calee} streamURL={res.response.stream.toURL()} />
        </View>
      );
    }
  };

  return (
    <RTCViews />
  );
};

const styles = StyleSheet.create({
  blackView: {
    flex: 1,
    backgroundColor: 'black',
  },
  localKey: {
    height: 180,
    width: 150,
    position:'absolute',
    top:10,
    left:-20,
  },
  remoteKey: {
    position:'relative',
    width: Dimensions.get('window').width,
	  height: Dimensions.get('window').height
  },
});

export default CallScreen;
