import React, { memo } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Searchbar, Appbar } from 'react-native-paper';
import { Navigation } from '../types';

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
    <View>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Messages</Text>}/>
      </Appbar.Header>

      <View style={styles.ground}>
        <Searchbar
          placeholder="Search"
        />
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <List.Item
                key="{item.id}"
                onPress={() => navigation.navigate('ChatScreen')}
                title={item.first_name + ' ' + item.last_name}
                description={item.content}
                left={props => <Avatar.Text style={styles.avatar} size={37} label={item.first_name.charAt(0)+item.last_name.charAt(0)} />}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    paddingTop: 0,
    padding: 20,
    // backgroundColor: '#eeeeee',
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
