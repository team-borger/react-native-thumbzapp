import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
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

  const _goBack = () => {
    navigation.navigate('HomeScreen')
  }

  const skeks = () => {
    setShowDeparture(true)
  }

  const setFrom = (event, selectedDate) => {
    setDeparture(selectedDate)
    setShowDeparture(false)
  };

  const setTo = (event, selectedDate) => {
    setReturn(selectedDate)
    setShowReturn(false)
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log(departure)
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
              <Card onPress={skeks}>
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
                  value={from}
                  onChangeText={text => setFromText(text)}
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
                  value={to}
                  onChangeText={text => setToText(text)}
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
                  value={from}
                  onChangeText={text => setFromText(text)}
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
                  value={to}
                  onChangeText={text => setToText(text)}
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
                  value={to}
                  onChangeText={text => setToText(text)}
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
                  value={to}
                  onChangeText={text => setToText(text)}
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
                  value={from}
                  onChangeText={text => setFromText(text)}
                />
              </View>
            </View>
          </View>
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
    marginHorizontal: 10
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
      paddingHorizontal: 20
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
