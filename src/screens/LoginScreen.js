import React, { memo, useState, useEffect } from 'react';
import axios from 'axios';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Button';
import CustomTextInput from '../components/TextInput';
import Banner from '../components/Banner';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { loginAPI } from '../services/auth';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService, CallService } from '../services';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error_, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error_ == true) {

      setTimeout(() => {
        setError(false)
      }, 3000)
      setError(true)
    }
  }, [error_]);

  const firstRendered = async () => {
    const token = await AsyncStorage.getItem('Token')
    if( token !== null ) {
      navigation.replace('AuthenticatedRoutes')
    }
  }

  firstRendered()


  _storeUserData = async (payload) => {
    await AsyncStorage.setItem('Token', payload.user.token)
    await AsyncStorage.setItem('user', JSON.stringify(payload.user))
  }

  const loginSuccess = res => {
    const { token } = res.data;
    _storeUserData(res.data)
    navigation.replace('AuthenticatedRoutes')
  }

  const loginError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      setError(true)
      setErrorMessage(error)
      Alert.alert('Login Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      setError(true)
      setErrorMessage(message)
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

      // loginAPI(body,loginSuccess,loginError);
      postData();
      // AuthService.login(body)
      //   .then(() => {
      //     CallService._setUpListeners()
      //     loginAPI(body,loginSuccess,loginError);
      //   })
      //   .catch(error => {
      //     setError(true)
      //     setErrorMessage(error.info.errors[0])
      //     console.error(error.info.errors[0]);
      //     setLoading(false)
      //   })
    }
  };

  const postData = async () => {
    const url = 'https://thumbzupp.com:82/api/login';
    
    const payload = {
      email: 'marcelo@tamsap.com',
      password: 'password'
    };
  
    try {
      const response = await axios.post(url, payload);
      console.log('__Response:', response.data);
    } catch (error) {
      console.error('__Error:', error);
    }
  };

  const showBanner = () => {
    return (
      <Banner
        visible={true}
        positive="close"
        message={errorMessage}
        icon="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png"
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      { error_ && showBanner() }

      <Background>

        <Logo />

        <CustomTextInput
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

        <CustomTextInput
          placeholder="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={passwordVisible}
          right={
            <TextInput.Icon icon={passwordVisible ? "eye" : "eye-off"}
              onPress={() => setPasswordVisible(!passwordVisible)} />
            }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
