import * as React from 'react';
import { Image } from 'react-native';
import { Banner } from 'react-native-paper';

const MyComponent = (props) => {
  const [visible, setVisible] = React.useState(props.visible);

  const toggle = () => {
    setVisible = !visible
  }

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: props.positive,
          onPress: () => setVisible(false),
        },
        {
          label: 'Learn more',
          onPress: () => setVisible(false),
        },
      ]}
      icon={({size}) => (
        <Image
          source={{
            uri: `https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png`,
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      )}>
      {props.message}
    </Banner>
  );
};

export default MyComponent;
