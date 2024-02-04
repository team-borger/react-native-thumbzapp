import React, { memo } from 'react';
import { View, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IMAGE } from '../constants/Image';

const Skekert = ({ navigation }) => {

  const _openWeb = () => {
    Linking.openURL('fb://page/1138454812942659')
  }

  return (
    <View style={styles.footer}>
      <View style={styles.centerFLex}>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <Image source={IMAGE.navbar.shop} style={styles.custom_image}  />
        </TouchableOpacity>
      </View>
      <View style={styles.centerFLex}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Image source={IMAGE.navbar.chat} style={styles.custom_image}  />
        </TouchableOpacity>
      </View>
      <View style={styles.centerFLex}>
        <TouchableOpacity onPress={() => navigation.navigate("NetLoadScreen")}>
          <Image source={IMAGE.navbar.load} style={styles.custom_image}  />
        </TouchableOpacity>
      </View>
      <View style={styles.centerFLex}>
        <TouchableOpacity onPress={() => navigation.navigate("BookScreen")}>
          <Image source={IMAGE.navbar.flight} style={styles.custom_image}  />
        </TouchableOpacity>
      </View>
      <View style={styles.centerFLex}>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
          <Image source={IMAGE.navbar.profile} style={styles.custom_image}  />
        </TouchableOpacity>
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
  custom_image: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
});

export default memo(Skekert);
