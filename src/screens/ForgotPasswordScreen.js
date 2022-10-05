import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState({ value: '', error: '' });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate('LoginScreen');
  };

  return (
    <Background>

      <Logo />

      <Header>Reset Password</Header>

      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
        <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
          Send Reset Instructions
        </Button>
      </View>

      <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.label}>← Back to login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: 'white',
    width: '100%',
  },
});

export default memo(ForgotPasswordScreen);
