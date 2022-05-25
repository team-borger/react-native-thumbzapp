import React from 'react';
import { StyleSheet, View, Button, Text, TextInput,Dimensions, TouchableOpacity } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RTCView } from 'react-native-connectycube';

const CallScreen = (response) => {

  const RTCViews = () => {
    const res = response.route.params;
    if(res.localKey) {
      return (
        <View style={styles.blackView}>
          <RTCView style={styles.localKey} key={res.localKey} streamURL={res.localStream.toURL()} mirror={true}/>
          <RTCView style={styles.remoteKey} objectFit="cover" key={res.remoteKey} streamURL={res.remoteStream.toURL()} mirror={true}/>
          <TouchableOpacity style={styles.dropCallButton}>
            <Avatar.Icon size={50} icon="phone-hangup" style={{backgroundColor:"#ff4a43"}}/>
          </TouchableOpacity>
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
    marginTop: 50,
    width: Dimensions.get('window').width,
	  height: Dimensions.get('window').height-140
  },
  dropCallButton: {
     position: 'absolute',
     width: 50,
     height: 50,
     alignItems: 'center',
     justifyContent: 'center',
     alignSelf: 'center',
     bottom: 20,
  }
});

export default CallScreen;
