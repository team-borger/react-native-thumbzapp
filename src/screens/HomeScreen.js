import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { Navigation } from '../types';
import NavbarBot from '../components/NavbarBot';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  navigation: Navigation;
};

const Shop = ({ navigation }: Props) => {

  const _goToCart = () => {
    navigation.navigate('CartScreen')
  }

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header dark={false} style={styles.header}>
        <Appbar.Content style={styles.marginText} title={<Text style={styles.setColorText}>Shop</Text>}/>
        <Appbar.Action icon="shopping" color="#880ED4" onPress={_goToCart} />
      </Appbar.Header>

      <View style={styles.contentContainer}>

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
  contentContainer: {
      flex: 1
  },
  ground: {
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
  }
});

export default memo(Shop);
