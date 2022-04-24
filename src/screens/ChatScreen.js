import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const Chat = ({ navigation }: Props) => {
  const _goBack = () => {
    navigation.navigate('Dashboard');
  }

  const _handleCall = () => console.log('Calling...');

  const _handlevideoCall = () => console.log('Video Calling...');

  return (
    <Appbar.Header dark={false} style={styles.header}>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title={<Text style={styles.setColorText}>Princess Garde</Text>}/>
      <Appbar.Action icon="phone" onPress={_handleCall} />
      <Appbar.Action icon="video" onPress={_handlevideoCall} />
    </Appbar.Header>

    // <View style={styles.ground}>
    //
    //   <Text style={styles.title}>Princess Garde</Text>
    //
    // </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    padding: 20,
    backgroundColor: '#eeeeee',
    height: '100vh'
  },
  setColorText : {
    color: '#880ED4'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '20px'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(Chat);
