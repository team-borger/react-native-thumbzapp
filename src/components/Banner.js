import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { Banner } from 'react-native-paper';

const MyComponent = (props) => {
  const [visible, setVisible] = React.useState(props.visible);

  useEffect(() => {
    if (visible == true) {
      setVisible(true)

      setTimeout(() => {
        setVisible(false)
      }, 3000)
    }
  }, [visible]);


  return (
    <Banner
      visible={visible}
      style={{position: 'absolute', zIndex: 2, left: 0, right: 0, top: 30}}
      actions={[
        {
          label: props.positive,
          onPress: () => setVisible(false),
        }
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
