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
  const [passedProcessing, setPassedProcessing] = useState(false);

  useEffect(() => {
    getLink();
  }, []);

  const getLink = async () => {
    const link = await AsyncStorage.getItem('xenditInvoiceUrl');
    setLink(link);
  };

  const webViewResponse = res => {
    const stagingCompletePattern = /^https:\/\/checkout-staging.xendit.co\/v2\/\w+$/;
    const stagingProcessingPattern = /^https:\/\/checkout-staging.xendit.co\/v2\/([\w-]+)\/(\w+)$/;

    const processingMatch = stagingProcessingPattern.test(res.url);
    if (processingMatch) {
      setPassedProcessing(true);
    }
    if (passedProcessing) {
      const completeMatch = stagingCompletePattern.test(res.url);

      if (completeMatch) {
        setTimeout(() => {
          navigation.navigate('PaymentSuccessScreen');
        }, 5000);
      }
    }
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
        <WebView
          source={{ uri: link }}
          style={{ flex: 1 }}
          onNavigationStateChange={webViewResponse}
        />
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
