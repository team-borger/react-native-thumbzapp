import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, RadioButton, TextInput, Card } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../core/theme';
import moment from 'moment';
import { bookAPI } from '../services/users';

type Props = {
  navigation: Navigation;
};

const BookScreen = ({ navigation }: Props) => {
  const [type, setType] = React.useState('');
  const [departure, setDeparture] = React.useState(new Date())
  const [showDeparture, setShowDeparture] = React.useState(false)
  const [returnDate, setReturn] = React.useState(new Date())
  const [showReturn, setShowReturn] = React.useState(false)
  const [trip, setTrip] = React.useState('Round-trip');
  const [choosenClass, setClass] = React.useState('');
  const [from, setFromText] = React.useState('');
  const [to, setToText] = React.useState('');
  const [adult, setAdult ] = React.useState(0);
  const [student, setStudent ] = React.useState(0);
  const [senior, setSenior ] = React.useState(0);
  const [youth, setYouth ] = React.useState(0);
  const [children, setChildren ] = React.useState(0);
  const [toddlers, setToddlers ] = React.useState(0);
  const [infant, setInfant ] = React.useState(0);
  const [tour_accommodation, setTourAccommodation ] = React.useState('');
  const [msg, setMsg ] = React.useState('');
  const [loginuser, setUser] = useState({});
  const [loading, setLoading] = useState(false)

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const skeks = () => {
    setShowDeparture(true)
  }

  const skeks2 = () => {
    setShowReturn(true)
  }

  const setFrom = (event, selectedDate) => {
    setDeparture(selectedDate)
    setShowDeparture(false)
  };

  const setTo = (event, selectedDate) => {
    setReturn(selectedDate)
    setShowReturn(false)
  };

  const saveSuccess = res => {
    setLoading(false)
    navigation.navigate('BookSuccess')
  }

  const saveError = err => {
    setLoading(false)
    const { error, message } = err.response.data;
    if (error) {
      Alert.alert('Something went wrong. Please try again.', error,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
    if (message) {
      Alert.alert('Something went wrong. Please try again.', message,
        [{ text: 'OK' },], { cancelable: false }
      );
    }
  }

  const saveBook = () => {
    setLoading(true)
    let payload = {
      id: loginuser.id,
      type: type,
      from: from,
      to: to,
      trip: trip,
      departure: departure,
      return: returnDate,
      class: choosenClass,
      adult: adult,
      student: student,
      senior: senior,
      youth: youth,
      children: children,
      toddlers: toddlers,
      infant: infant,
      tour_accommodation: tour_accommodation,
      msg: msg,
    }
    bookAPI(payload, saveSuccess, saveError)
  }

  const _geUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('user')
      if (value !== null) {
        const ret = JSON.parse(value);
        setUser(ret)
      }
    } catch (error) {
      console.log('error async storage')
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      _geUserInfo()
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#880ED4' }}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={_goBack} underlayColor="#eeeeee">
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="white"
              style={{marginRight: 15}}
            />
          </TouchableHighlight>
          <Text style={styles.headerText}>Book a Flight</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 10}}>
            <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
              <View style={{flexDirection: 'row', display: 'flex'}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="Domestic" />
                  <Text>Domestic</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="International" />
                  <Text>International</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={{marginTop: 10, marginBottom: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Tour Accommodation</Text>
          </View>
          <View>
            <RadioButton.Group onValueChange={newValue => setTourAccommodation(newValue)} value={tour_accommodation}>
              <View style={{flexDirection: 'row', display: 'flex'}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="Yes" />
                  <Text>Yes</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="No" />
                  <Text>No</Text>
                </View>
              </View>
            </RadioButton.Group>
            <View style={{marginVertical: 7, marginHorizontal: 7}}>
              <Text>Message</Text>
              <TextInput
                style={{backgroundColor: theme.colors.surface, fontSize: 14,}}
                multiline={true}
                numberOfLines={3}
                onChangeText={text => setMsg(text)}
                value={msg}
                theme={{ roundness: 5 }}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
              />
            </View>
          </View>
          <View style={{marginTop: 10, marginBottom: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Destination</Text>
          </View>
          <View>
            <View style={{marginVertical: 7}}>
              <Text>From</Text>
              <TextInput
                style={styles.input}
                theme={{ roundness: 5 }}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                value={from}
                onChangeText={text => setFromText(text)}
              />
            </View>
            <View style={{marginVertical: 7}}>
              <Text>To</Text>
              <TextInput
                style={styles.input}
                theme={{ roundness: 5 }}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                value={to}
                onChangeText={text => setToText(text)}
              />
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <RadioButton.Group onValueChange={newValue => setTrip(newValue)} value={trip}>
              <View style={{flexDirection: 'row', display: 'flex'}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="Round-trip" />
                  <Text>Round-trip</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 30}}>
                  <RadioButton value="One-way" />
                  <Text>One-way</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View>
            <View style={{marginVertical: 7}}>
              <Text>{trip === 'Round-trip' ? 'Departure' : 'Departing on'}</Text>
              <Card onPress={skeks}>
                <Card.Content style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', color: 'gray'}}>{moment(departure).format('MMMM DD, YYYY')}</Text>
                </Card.Content>
              </Card>
            </View>
            <View style={trip === 'Round-trip' ? {marginVertical: 7} : {display: 'none'}}>
              <Text>Return</Text>
              <Card onPress={skeks2}>
                <Card.Content style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', color: 'gray'}}>{moment(returnDate).format('MMMM DD, YYYY')}</Text>
                </Card.Content>
              </Card>
            </View>

            {showDeparture && (
              <DateTimePicker
                value={departure}
                display="default"
                mode="date"
                onChange={setFrom}
              />
            )}
            {showReturn && (
              <DateTimePicker
                value={returnDate}
                display="default"
                mode="date"
                onChange={setTo}
              />
            )}
            <View style={{marginTop: 10, marginBottom: 5}}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Passengers</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text>Cabin Class</Text>
            </View>
            <View>
              <RadioButton.Group onValueChange={newValue => setClass(newValue)} value={choosenClass}>
                <View style={{flexDirection: 'row', display: 'flex', flex: 1, flexWrap: 'wrap'}}>
                  <View style={{flexBasis: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                    <RadioButton value="Economy" />
                    <Text>Economy</Text>
                  </View>
                  <View style={{flexBasis: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                    <RadioButton value="Business" />
                    <Text>Business</Text>
                  </View>
                  <View style={{flexBasis: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                    <RadioButton value="Premium Economy" />
                    <Text>Premium Economy</Text>
                  </View>
                  <View style={{flexBasis: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5}}>
                    <RadioButton value="First Class" />
                    <Text>First Class</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>Provide number of passengers</Text>
            </View>
            <View style={{flexDirection: 'row', display: 'flex', flex: 1, flexWrap: 'wrap'}}>
              <View style={{marginVertical: 7,flexBasis: '50%', paddingHorizontal: 5}}>
                <Text>Adults (18-64)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={adult}
                  onChangeText={text => setAdult(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '50%', paddingHorizontal: 5}}>
                <Text>Students (Over 18)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={student}
                  onChangeText={text => setStudent(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '50%', paddingHorizontal: 5}}>
                <Text>Seniors (65+)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={senior}
                  onChangeText={text => setSenior(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '50%', paddingHorizontal: 5}}>
                <Text>Youths (12-17)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={youth}
                  onChangeText={text => setYouth(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '40%', paddingHorizontal: 5}}>
                <Text>Children (2-11)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={children}
                  onChangeText={text => setChildren(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '60%', paddingHorizontal: 5}}>
                <Text>Infants on lap (under 2)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={infant}
                  onChangeText={text => setInfant(text)}
                />
              </View>
              <View style={{marginVertical: 7,flexBasis: '100%', paddingHorizontal: 5}}>
                <Text>Toddlers in own seat (under 2)</Text>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={theme.colors.primary}
                  underlineColor="transparent"
                  mode="outlined"
                  keyboardType='numeric'
                  value={toddlers}
                  onChangeText={text => setToddlers(text)}
                />
              </View>
            </View>
          </View>
          <Button style={styles.logoutBtn} mode="contained" onPress={saveBook}>
            {loading ? 'Saving...' : `Save`}
          </Button>
        </ScrollView>
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 14,
    height: 50
  },
  item: {
    width: '100%' // is 50% of container width
  },
  cardStyle: {
    margin: 5
  },
  contentContainer: {
      flex: 1,
      padding: 5,
      paddingHorizontal: 20,
  },
  marginText: {
    marginLeft: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  setColorText : {
    color: '#880ED4'
  },
  headerText : {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: 'transparent'
  }
});

export default memo(BookScreen);
