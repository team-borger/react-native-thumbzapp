import React, { memo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { theme } from '../core/theme';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };


const TextPassword = ({ errorText, ...props }: Props) => (

  <View style={styles.container}>
    <TextInput
      style={styles.input}
      theme={{ roundness: 5 }}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 3,
    paddingLeft: 20,
    paddingRight: 20
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 12,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextPassword);
