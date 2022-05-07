import React, { memo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Searchbar, Appbar, Card } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { conversationsAPI } from '../services/messages';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [items, setItems] = useState({})

  const fetchSuccess = res => {
    setItems(res.data)
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

  useFocusEffect(
    React.useCallback(() => {
      conversationsAPI(fetchSuccess,fetchError);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Messages</Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Searchbar
          placeholder="Search"
        />
        <FlatList
          style={styles.scrollView}
          data={items}
          renderItem={({ item }) => (
            // <Card>
            //   <Text>{item.contact.first_name + ' ' + item.contact.last_name}</Text>
            // </Card>
            <List.Item
              key="{item.id}"
              onPress={() => navigation.navigate('ChatScreen')}
              title={item.contact.first_name + ' ' + item.contact.last_name}
              description={item.spoiler_chat}
              left={props => <Avatar.Text style={styles.avatar} size={37} label={item.contact.first_name.charAt(0)+item.contact.last_name.charAt(0)} />}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  contentContainer: {
      flex: 1,
      paddingTop: 0,
      padding: 20,
      height: '100%'
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
  header: {
    backgroundColor: 'transparent'
  },
  avatar: {
    marginTop: 6,
    marginBottom: 6
  },
  scrollView: {
    marginTop: 10
  }
});

export default memo(Dashboard);
