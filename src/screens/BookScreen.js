import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
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
  const [from, setFromText] = React.useState('');
  const [to, setToText] = React.useState('');

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
        </View>
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
