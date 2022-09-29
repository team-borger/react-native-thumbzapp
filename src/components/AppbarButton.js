import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../core/theme';

type Props = React.ComponentProps<typeof PaperButton>;

const AppbarButton = ({ mode, style, children, ...props }: Props) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: 'theme.colors.surface' },
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    height: 30,
    backgroundColor: 'white'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#880ED4',
    textTransform: 'none'
  },
});

export default memo(AppbarButton);
