import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Navigation } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { IMAGE } from '../constants/Image';

type Props = {
  navigation: Navigation;
};

const ForgotPassEmail = ({ navigation }: Props) => {

  const _goBack = () => {
    navigation.navigate('LoginScreen');
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.contentContainer}>
        <View style={styles.skeks}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: 'gray'}}>Check your email</Text>
            <Text style={{fontSize: 16, color: 'gray', textAlign: 'center', paddingTop: 10}}>We have sent a password reset instructions to your email.</Text>
          </View>
          <View style={{paddingTop: 10, alignItems: 'center'}}>
            <Image source={IMAGE.EMAIL_VERIFY} style={styles.image} />
          </View>
          <View style={{paddingVertical: 20}}>
            <Button mode="contained" style={styles.btn} onPress={() => navigation.navigate('LoginScreen')}>
              Back to Login Screen
            </Button>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  skeks: {
    padding: 30
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    backgroundColor: '#880ED4',
    padding: 5,
    borderRadius: 0
  }
});

export default memo(ForgotPassEmail);
