import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function LottieIframeExample({
  text = 'Lisbon',
  redirect = '',
  onPress = '',
  imageSource,
}) {
  const lottieURL =
    'https://lottie.host/embed/03b91591-4b3e-44d7-9c22-564aa146838f/pREYmzHGiO.json';

  const handlePress = () => {
    // Perform any action on press
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.container}>
          <WebView
            source={{ uri: imageSource || lottieURL }}
            style={styles.webview}
            allowsInlineMediaPlayback
          />
          <View style={styles.overlay}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 20,
    paddingTop: 10,
  },
});
