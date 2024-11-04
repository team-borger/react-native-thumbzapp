import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
// import { router } from 'expo-router';

export default function ImageBackgroundExample({
  text = "Lisbon",
  imageSource,
  redirect = "",
  onPress = "",
}) {
  const defaultImage = {
    uri: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
  };

  const handlePress = () => {
    // ToastAndroid.show("BITCH! Nigahe na ang akong oten 🎶", ToastAndroid.SHORT);
    // router.push(`/${redirect}`);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <ImageBackground
          source={imageSource || defaultImage}
          resizeMode="cover"
          style={styles.imageBackground}
          imageStyle={styles.imageRounded}
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    height: 150,
    marginVertical: 10,
    marginHorizontal: 20, // Adds left and right margin
    borderRadius: 20, // Rounds outer container edges
    overflow: "hidden", // Ensures child content is rounded too
  },
  imageRounded: {
    borderRadius: 20, // Rounds inner image content
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
});
