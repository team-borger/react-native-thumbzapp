import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { suggestedContactAPI, searchUsersAPI } from '../services/users';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const SearchContact = ({ navigation }: Props) => {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState([])
  const [suggested, setSuggested] = useState([])

  const textInputRef = React.useRef();

  const _onContactClick = (item) => {
    const payload = {
      contact: item
    }
    AsyncStorage.setItem('active_chat', JSON.stringify(payload))
    navigation.replace('ChatScreen')
  }

  const _goBack = () => {
    navigation.navigate('Dashboard');
  }

  const fetchSuggestSuccess = res => {
    setSuggested(res.data)
  }

  const searchSuccess = res => {
    setContacts(res.data)
  }

  const fetchError = err => {
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

  const onChangeSearch = query => {
    setSearch(query)
    const body = {
      keyword: query === '' ? 'emptynullempty' : query
    }
    setTimeout(() => {
      searchUsersAPI(body, searchSuccess, fetchError)
    }, 1000)
  }

  useFocusEffect(
    React.useCallback(() => {
      suggestedContactAPI(fetchSuggestSuccess, fetchError);
      if(textInputRef.current){
        const unsubscribe = navigation.addListener('focus', () => {
          textInputRef.current?.focus()
        });
        return unsubscribe;
      }
    }, [navigation, textInputRef.current])
  );

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Search User</Text>} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Searchbar
          ref={textInputRef}
          placeholder="Search"
          style={contacts.length > 0 ? {marginBottom: 20} : {}}
          onChangeText={onChangeSearch}
          value={search}
        />
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.alignCenterRow} key={item.id} onPress={() => _onContactClick(item)}>
              <View style={styles.alignCenterRow}>
                <Avatar.Text style={styles.avatar} size={37} label={item.first_name.charAt(0) + item.last_name.charAt(0)} />
                <View style={{marginLeft: 10, flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>{item.first_name + ' ' + item.last_name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text style={{fontWeight: 'bold', marginTop: 20}}>Suggested</Text>
        <FlatList
          style={styles.scrollView}
          data={suggested}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.alignCenterRow} key={item.id} onPress={() => _onContactClick(item)}>
              <View style={styles.alignCenterRow}>
                <Avatar.Text style={styles.avatar} size={37} label={item.first_name.charAt(0) + item.last_name.charAt(0)} />
                <View style={{marginLeft: 10, flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>{item.first_name + ' ' + item.last_name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignCenterRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentContainer: {
    paddingTop: 0,
    padding: 20,
  },
  marginText: {
    marginLeft: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  setColorText: {
    color: '#880ED4'
  },
  header: {
    backgroundColor: 'transparent'
  },
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10,
    marginLeft: 5
  }
});

export default memo(SearchContact);
