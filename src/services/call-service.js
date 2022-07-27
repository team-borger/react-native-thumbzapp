import * as RootNavigation from '../components/RootNavigation';
import { Platform, ToastAndroid, Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import ConnectyCube from 'react-native-connectycube';
import CallScreen from "../screens/CallScreen";
import InCallManager from 'react-native-incall-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

export default class CallService {
  static MEDIA_OPTIONS = { audio: true, video: { facingMode: 'user' } };
  _session = null;
  mediaDevices = [];

  _incomingCallSession = null;
  _localStream = null;

  outgoingCall = new Sound(require('../assets/audio/dialing.mp3'));
  incomingCall = new Sound(require('../assets/audio/calling.mp3'));
  endCall = new Sound(require('../assets/audio/end_call.mp3'));

  showToast = text => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
  };

  setMediaDevices() {
    return ConnectyCube.videochat.getMediaDevices().then(mediaDevices => {
      this.mediaDevices = mediaDevices;
    });
  }

  _setUpListeners() {
    ConnectyCube.videochat.onCallListener = this._onCallListener;
    ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
    ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
    ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
    ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
    ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
    ConnectyCube.videochat.onSessionConnectionStateChangedListener = this._onSessionConnectionStateChangedListener;
  }

  startCall = async callee => {
    let calleesIds = []; // User's ids

    const session_ = JSON.parse(await AsyncStorage.getItem('session_'))

    calleesIds.push(callee.connectycube_id)
    // if(session_.id == 5757268) calleesIds.push(5744964)
    // else calleesIds.push(5757268)

    const sessionType = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
    const additionalOptions = { bandwidth: 256 };
    this._session = ConnectyCube.videochat.createNewSession(calleesIds, sessionType, additionalOptions);

    return this._session
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then((stream) => {
        console.log('on sessionCreate', stream)
        this._session.call({});

        return {calee: session_.id, stream: stream}
        // RootNavigation.navigate('CallScreen', { calee: session_.id, stream: stream });
      })
      .catch((error) => {
        console.error('session error', error)
      });
  };

  acceptCall = () => {
    // const onCallSession = JSON.parse(await AsyncStorage.getItem('onCallSession'))
    this.stopSounds();
    this.setMediaDevices();

    return this._incomingCallSession
      .getUserMedia(CallService.MEDIA_OPTIONS)
      .then(stream => {
        this._incomingCallSession.accept({});
        return stream;
      });
  };

  stopCall = () => {
    this.stopSounds();

    console.log('stopCall session before', this._session);
    if (this._session) {
      RootNavigation.navigate('ChatScreen');
      this.playSound('end')
      this._session.stop({});
      // ConnectyCube.videochat.clearSession(this._session.ID);
      // this._session = null;
      this.mediaDevices = [];
      console.log('stopCall session after', this._session);
    }
  };

  rejectCall = () => {
    this.stopSounds();
    this._incomingCallSession.reject({});
  };

  playSound = type => {
    switch (type) {
      case 'outgoing':
        this.outgoingCall.setNumberOfLoops(-1);
        this.outgoingCall.play();
        break;
      case 'incoming':
        this.incomingCall.setNumberOfLoops(-1);
        this.incomingCall.play();
        break;
      case 'end':
        this.endCall.play();
        break;

      default:
        break;
    }
  };

  stopSounds = () => {
    if (this.incomingCall.isPlaying()) {
      this.incomingCall.pause();
    }
    if (this.outgoingCall.isPlaying()) {
      this.outgoingCall.pause();
    }
  };

  muteAudio = params => {
    if(params.status) {
      this._session.mute("audio")
    }
    else {
      this._session.unmute("audio")
    }
    this.showToast(`microphone ${ params.status ? 'muted' : 'unmuted' }`)
  };

  toggleSpeaker = params => {
    InCallManager.setSpeakerphoneOn(params.status);
    this.showToast(`Loud speaker ${ params.status ? 'enabled' : 'disabled' }`)
  };

  toggleCameras = () => {
    this._localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  _onCallListener = (session, extension) => {
    this._incomingCallSession = session
    console.log('_onCallListener 1:', session)
    console.log('_onCallListener 2:', extension)
    this.playSound('incoming');
    this.showToast(`Incoming call!`)

    ConnectyCube.users
      .get({
        filter: {
          field: "id",
          param: "eq",
          value: session.initiatorID,
        }
      })
      .then((result) => {
        console.log('_onCallListener searchUserById', result.items[0].user.full_name)
        RootNavigation.navigate('IncomingCallScreen', {initiator: result.items[0].user.full_name})
      })
      .catch((error) => {
        console.error('_onCallListener searchUserById', error)
      });
  };

  _onUserNotAnswerListener = (session, userId) => {
    this.showToast(`${userId} could not answer!`)

    RootNavigation.navigate('ChatScreen');
  }

  _onRejectCallListener = (session, userId, extension) => {
    this.showToast(`${userId} Rejected!`)

    RootNavigation.navigate('ChatScreen');
  };

  _onStopCallListener = (session, userId, extension) => {
    // opponent only
    console.log('_onStopCallListener');
    this._session.stop({});
    RootNavigation.navigate('ChatScreen');
  };

  _onAcceptCallListener = (session, userId, extension) => {
    // this.showToast(`${userId} answered!`)
  };

  _onRemoteStreamListener = (session, userID, remoteStream) => {
    this._session = session;
    this._localStream = session.localStream;
    RootNavigation.navigate('CallScreen', {
        localKey: session.currentUserID,
        localStream: session.localStream,
        remoteKey: userID,
        remoteStream: remoteStream,
      });
  };

  _onSessionConnectionStateChangedListener = (session, userID, connectionState) => {
    console.log(connectionState)
  };
}
