import React, { memo } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Skekert = ({ navigation }) => {

  const _openWeb = () => {
    Linking.openURL('fb://page/1138454812942659')
  }

  return (
    <View style={styles.footer}>
      <View style={styles.centerFLex}>
        <FontAwesome name='shopping-bag' onPress={() => navigation.navigate("HomeScreen")} size={22} color='#333' />
      </View>
      <View style={styles.centerFLex}>
        <FontAwesome name='comment' onPress={() => navigation.navigate("Dashboard")} size={22} color='#333' />
      </View>
      <View style={styles.centerFLex}>
        <FontAwesome name='mobile-phone' onPress={() => navigation.navigate("NetLoadScreen")} size={22} color='#333' />
      </View>
      <View style={styles.centerFLex}>
        <Ionicons name='airplane' onPress={_openWeb} size={22} color='#333' />
      </View>
      <View style={styles.centerFLex}>
        <FontAwesome name='user' onPress={() => navigation.navigate("ProfileScreen")} size={22} color='#333' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerFLex: {
    flex: 1,
    alignItems: 'center'
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: "row"
  },
});

export default memo(Skekert);
