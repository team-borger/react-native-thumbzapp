import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { AuthService } from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  firstNameValidator,
  lastNameValidator,
  countryValidator,
  phoneValidator,
} from '../core/utils';
import { COUNTRIES } from '../constants/Country';
import { registerAPI, checkEmailAPI } from '../services/auth';
import SelectDropdown from 'react-native-select-dropdown'
import { MaskedTextInput } from "react-native-mask-text";
import ImgToBase64 from 'react-native-image-base64';
import { IMAGE } from '../constants/Image';

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [first_name, setFirstName] = useState({ value: '', error: '' });
  const [middle_name, setMiddleName] = useState({ value: '', error: '' });
  const [last_name, setLastName] = useState({ value: '', error: '' });
  const [country, setCountry] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirm_password, setConfirmPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  let body = null;

  const emailUnique = res => {
    if(!Boolean(res.data)) {
      const CONNECTY_SIGNUP_PARAMS = {
        full_name: `${body.first_name} ${body.last_name}`,
        email: body.email,
        phone: body.phone,
        password: body.password,
      };
      AuthService.register(CONNECTY_SIGNUP_PARAMS)
        .then(() => {
          register();
        })
    }
  };

  const register = async () => {
    body.connectycube_id = Number(await AsyncStorage.getItem('connectycube_id'))
    registerAPI(body, registerSuccess, registerError);
  };

  const emailExists = err => {
    console.error('emailExists', err)
    setLoading(false)
  };

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
    // const firstNameError = firstNameValidator('Alan Benedict');
    // const lastNameError = lastNameValidator('Golpz');
    // const countryError = countryValidator('PHILIPPINES');
    // const phoneError = phoneValidator('54545454676');
    // const emailError = emailValidator('test@gmail.com');
    // const passwordError = passwordValidator('password');
    // const confirmPasswordError = confirmPasswordValidator('password', 'password');

    const firstNameError = firstNameValidator(first_name.value);
    const lastNameError = lastNameValidator(last_name.value);
    const countryError = countryValidator(country.value);
    const phoneError = phoneValidator(phone.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = confirmPasswordValidator(confirm_password.value, password.value);

    if (firstNameError || lastNameError || countryError || phoneError || emailError || passwordError || confirmPasswordError) {
      setFirstName({ ...first_name, error: firstNameError });
      setLastName({ ...last_name, error: lastNameError });
      setCountry({ ...country, error: countryError });
      setPhone({ ...phone, error: phoneError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirm_password, error: confirmPasswordError });
      return;
    } else {
      body = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirm_password: confirm_password.value,
        country: country.value,
        role_id: 3,
        profile_image: null
      };
      // body = {
      //   first_name: 'Alan Benedict',
      //   middle_name: 'Brandino',
      //   last_name: 'Golpeo',
      //   phone: '09123123123',
      //   email: 'ben@ttest.com',
      //   password: '12345678',
      //   confirm_password: '12345678',
      //   country: 'PHILIPPINES',
      //   role_id: 3,
      //   profile_image: null
      // };
      // console.log(body)
      setLoading(true)
      checkEmailAPI(body, emailUnique, emailExists)
      // ImgToBase64.getBase64String(IMAGE.LOGO)
      // .then(base64String => console.log('aaa: ',base64String))
      // .catch(err => doSomethingWith(err));

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

              <View style={{marginHorizontal: 20, marginTop: 10, marginBottom: 5}}>
                <SelectDropdown
                  data={COUNTRIES}
                  onSelect={(selectedItem, index) => {
                    country.value = selectedItem
                  }}
                  defaultButtonText={'Select country'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdown1BtnStyle}
                  buttonTextStyle={styles.dropdown1BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={10} />;
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown1DropdownStyle}
                  rowStyle={styles.dropdown1RowStyle}
                  rowTextStyle={styles.dropdown1RowTxtStyle}
                  selectedRowStyle={styles.dropdown1SelectedRowStyle}
                  search
                  searchInputStyle={styles.dropdown1searchInputStyleStyle}
                  searchPlaceHolder={'Search here'}
                  searchPlaceHolderColor={'darkgrey'}
                  renderSearchInputLeftIcon={() => {
                    return <FontAwesome name={'search'} color={'#444'} size={18} />;
                  }}
                />
              </View>

              <View style={{marginHorizontal: 20, marginTop: 10, marginBottom: 5}}>
                <MaskedTextInput
                  placeholder="Mobile number"
                  mask="99999999999"
                  keyboardType="numeric"
                  value={phone.value}
                  onChangeText={text => setPhone({ value: text, error: '' })}
                  style={styles.inputPhone}
                  error={!!phone.error}
                  errorText={phone.error}
                />
              </View>

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
  dropdown1BtnStyle: {
    width: '100%',
    height: 57,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444'
  },
  inputPhone: {
    width: '100%',
    height: 57,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 15,
    color: '#777',
    fontSize: 12
  },
  dropdown1BtnTxtStyle: {
    color: '#777',
    textAlign: 'left',
    backgroundColor: theme.colors.surface,
    fontSize: 12,
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5', paddingHorizontal: 10},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
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
