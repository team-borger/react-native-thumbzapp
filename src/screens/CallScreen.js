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
    const [isMuted, setMute] = useState(true);
    const [isMutedVideo, setMuteVideo] = useState(true);
    const [isLoudSpeaker, setLoudSpeaker] = useState(true);
    const [isCameraFacingFront, setCameraFacingFront] = useState(true);

    const res = response.route.params;

    const toggleSpeaker = () => {
      setLoudSpeaker(!isLoudSpeaker);
      CallService.toggleSpeaker({ status: isLoudSpeaker })
    };

    const onMuteMicPressed = () => {
      setMute(!isMuted);
      CallService.muteAudio({ status: isMuted });
    };

    const onMuteVideoPressed = () => {
      
      setMuteVideo(!isMutedVideo);
      CallService.muteVideo({ status: isMutedVideo });
      onAudioCall
    };

    const onCameraTogglePressed = () => {
      CallService.toggleCameras();
    };

    const onAudioCall = () => {
      return (
        <View>
          <RTCView style={styles.localKey} key={res.localKey} streamURL={res.localStream.toURL()} mirror={isCameraFacingFront ? true : false}/>
          <RTCView style={styles.remoteKey} objectFit="cover" key={res.remoteKey} streamURL={res.remoteStream.toURL()} mirror={isCameraFacingFront ? false : true}/>
        </View>
       
        );
    };

    if(res.localKey) {
      return (
        <View style={styles.blackView}>
          {{ onAudioCall }}
          <View style={styles.dropCallButton}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableOpacity style={{marginHorizontal: 5}} onPress={onMuteVideoPressed}>
                <Avatar.Icon size={50} icon={isMutedVideo ? "video" : "video-off"} style={{backgroundColor:"white"}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={toggleSpeaker}>
                <Avatar.Icon size={50} icon={isLoudSpeaker ? "headphones" : "volume-high"} style={{backgroundColor:"white"}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={onMuteMicPressed}>
                <Avatar.Icon size={50} icon={isMuted ? "microphone" : "microphone-off"} style={{backgroundColor:"white"}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={onStopCallPressed}>
                <Avatar.Icon size={50} icon="phone-hangup" style={{backgroundColor:"#ff4a43"}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 5}} onPress={onCameraTogglePressed}>
                <Avatar.Icon size={50} icon="camera-flip" style={{backgroundColor:"#909090"}}/>
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
