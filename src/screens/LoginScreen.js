import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { loginAPI } from '../services/auth';
import { Navigation } from '../types';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);

  const loginSuccess = res => {
    const { token } = res.data;
    navigation.replace('Dashboard')
  }

  const loginError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      Alert.alert('Login Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Login Error', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      const body = {
        email : email.value,
        password : password.value
      };
      setLoading(true)
      loginAPI(body,loginSuccess,loginError);
    }
  };

  return (
    <Background>

      <Logo />

      <TextInput
        placeholder="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
        <Button mode="contained" onPress={_onLoginPressed}>
        {loading ? 'Loading...' : 'Login'}
        </Button>
      </View>

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, }}>
        <View style={styles.hairline} />
        <Text style={styles.loginButtonBelowText1}>OR</Text>
        <View style={styles.hairline} />
      </View>

      <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%' }}>
        <Button mode="contained" onPress={() => navigation.navigate('RegisterScreen')}>
          Create an account
        </Button>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  hairline: {
    backgroundColor: 'white',
    height: 1,
    width: 130
  },
  loginButtonBelowText1: {
    fontSize: 15,
    paddingHorizontal: 10,
    alignSelf: 'center',
    color: 'white'
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: '#ffffff',
  },
  forgotText: {
    color: '#ffffff',
    fontSize: 16,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  }
});

export default LoginScreen;
