import React, { memo } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, List, Avatar, Searchbar, Appbar } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';

type Props = {
  navigation: Navigation;
};

const items = [
  {"id":"1","first_name":"Princess","last_name": "Garde","content":"How are you?"},
  {"id":"2","first_name": "Raymund","last_name": "Hinlog","content":"How are you?"},
  {"id":"3","first_name":"Alan","last_name": "Golpeo","content":"How are you?"},
  {"id":"4","first_name":"Skiko","last_name": "Hinlog","content":"How are you?"}
];

const Dashboard = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}> </Text>}/>
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Avatar.Icon size={100} icon="account" color="white" style={styles.avatar} />
        <Text>Princess Garde</Text>
        <Button icon="logout" style={styles.logoutBtn} mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
          Logout
        </Button>
      </View>

      <NavbarBot navigation={navigation}></NavbarBot>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#880ED4',
    marginTop: 20
  },
  avatar: {
    backgroundColor: '#880ED4',
    marginTop: 30
  },
  contentContainer: {
      flex: 1,
      paddingTop: 0,
      padding: 20,
      height: '100%',
      alignItems: 'center'
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
