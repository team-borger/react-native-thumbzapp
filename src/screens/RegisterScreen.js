import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  firstNameValidator,
  lastNameValidator,
  phoneValidator,
} from '../core/utils';
import { registerAPI } from '../services/auth';

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [first_name, setFirstName] = useState({ value: '', error: '' });
  const [middle_name, setMiddleName] = useState({ value: '', error: '' });
  const [last_name, setLastName] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirm_password, setConfirmPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);

  const registerSuccess = res => {
    setLoading(false)
    const { data } = res.data;
    navigation.replace('LoginScreen')
  }

  const registerError = err => {
    const { error, message } = err.response.data;
    setLoading(false)
    if (error) {
      Alert.alert('Registration Error', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Registration Error', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const _onSignUpPressed = () => {
    const firstNameError = firstNameValidator(first_name.value);
    const lastNameError = lastNameValidator(last_name.value);
    const phoneError = phoneValidator(phone.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = confirmPasswordValidator(confirm_password.value, password.value);

    if (firstNameError || lastNameError || phoneError || emailError || passwordError || confirmPasswordError) {
      setFirstName({ ...first_name, error: firstNameError });
      setLastName({ ...last_name, error: lastNameError });
      setPhone({ ...phone, error: phoneError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirm_password, error: confirmPasswordError });
      return;
    } else {
      const body = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirm_password: confirm_password.value,
      };
      setLoading(true)
      registerAPI(body,registerSuccess,registerError);
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <Appbar.Header dark={false} style={styles.header}>
        </Appbar.Header>
        <View style={{ flex: 1 }}>
          <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 20, paddingBottom: 0 }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Create an Account</Text>
          </View>
          <View style={{flex: 1}}>
            <ScrollView style={styles.scrollView}>
              <TextInput
                placeholder="First name"
                returnKeyType="next"
                value={first_name.value}
                onChangeText={text => setFirstName({ value: text, error: '' })}
                error={!!first_name.error}
                errorText={first_name.error}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Middle name"
                returnKeyType="next"
                value={middle_name.value}
                onChangeText={text => setMiddleName({ value: text, error: '' })}
                error={!!middle_name.error}
                errorText={middle_name.error}
              />

              <TextInput
                placeholder="Last name"
                returnKeyType="next"
                value={last_name.value}
                onChangeText={text => setLastName({ value: text, error: '' })}
                error={!!last_name.error}
                errorText={last_name.error}
              />

              <TextInput
                placeholder="Mobile number"
                returnKeyType="next"
                value={phone.value}
                onChangeText={text => setPhone({ value: text, error: '' })}
                error={!!phone.error}
                errorText={phone.error}
              />

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

              <TextInput
                placeholder="Confirm password"
                returnKeyType="done"
                value={confirm_password.value}
                onChangeText={text => setConfirmPassword({ value: text, error: '' })}
                error={!!confirm_password.error}
                errorText={confirm_password.error}
                secureTextEntry
              />
              <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
                  {loading ? 'Loading...' : 'Register'}
                </Button>
              </View>
              <View style={{ padding: 20}}>
                <TouchableOpacity
                  style={styles.back}
                  onPress={() => navigation.navigate('LoginScreen')}
                >
                  <Text style={styles.backText}>← Back to login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

      </SafeAreaView>

    </Background>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 5,
    backgroundColor: 'transparent'
  },
  label: {
    color: theme.colors.secondary,
  },
  back: {
    marginTop: 30,
  },
  backText: {
    color: 'white'
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(RegisterScreen);
