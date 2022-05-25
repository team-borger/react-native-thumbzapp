import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, TextInput,Dimensions, TouchableOpacity } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RTCView } from 'react-native-connectycube';
import { CallService } from '../services';

const CallScreen = (response) => {

  const onStopCallPressed = () => {
    CallService.stopCall();
  };

  const RTCViews = () => {
    const [isMuted, setMute] = useState(false);
    const res = response.route.params;

    const _muteCall = () => {
      if (isMuted == false) {
        setMute(true)
      } else {
        setMute(false)
      }
    }

    if(res.localKey) {
      return (
        <View style={styles.blackView}>
          <RTCView style={styles.localKey} key={res.localKey} streamURL={res.localStream.toURL()} mirror={true}/>
          <RTCView style={styles.remoteKey} objectFit="cover" key={res.remoteKey} streamURL={res.remoteStream.toURL()} mirror={true}/>
          <View style={styles.dropCallButton}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={_muteCall}>
                <Avatar.Icon size={50} icon={isMuted ? "microphone-off" : "microphone"} style={{backgroundColor:"white"}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={onStopCallPressed}>
                <Avatar.Icon size={50} icon="phone-hangup" style={{backgroundColor:"#ff4a43"}}/>
              </TouchableOpacity>
            </View>
          </View>
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
