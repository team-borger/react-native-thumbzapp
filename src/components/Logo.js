import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { IMAGE } from '../constants/Image';

const Logo = () => (
  <Image source={IMAGE.LOGO} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 12,
  },
});

export default memo(Logo);
