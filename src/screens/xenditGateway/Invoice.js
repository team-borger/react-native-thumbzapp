import React, { memo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation,
};

const XenditInvoice = ({ navigation }: Props) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    getLink();
  }, []);

  const getLink = async () => {
    const link = await AsyncStorage.getItem('xenditInvoiceUrl');
    setLink(link);
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <View style={styles.contentContainer}>
        <View
          style={{
            borderBottomColor: '#eeeeee',
            borderBottomWidth: 4,
          }}
        />
        <WebView source={{ uri: link }} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    flex: 1,
  },
});

export default memo(XenditInvoice);
