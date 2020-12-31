import React from 'react';
import {
  View,
  ActivityIndicator as NativeActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Theme from '../Theme.style';

const style = StyleSheet.create({
  container: {
    padding: 15,
  },
});

interface Props {
  animating?: boolean;
  style?: ViewStyle;
}

export default function ActivityIndicator(props: Props): JSX.Element {
  return (
    <View style={[style.container, props.style]}>
      <NativeActivityIndicator
        size="large"
        color={Theme.colors.white}
        animating={props.animating}
      ></NativeActivityIndicator>
    </View>
  );
}
