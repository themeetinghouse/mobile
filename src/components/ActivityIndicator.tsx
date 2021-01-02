import React from 'react';
import {
  View,
  ActivityIndicator as NativeActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Theme from '../Theme.style';

const indicatorStyle = StyleSheet.create({
  container: {
    padding: 15,
  },
});

interface Props {
  animating?: boolean;
  style?: ViewStyle;
}

export default function ActivityIndicator({
  animating,
  style,
}: Props): JSX.Element {
  return (
    <View style={[indicatorStyle.container, style]}>
      <NativeActivityIndicator
        size="large"
        color={Theme.colors.white}
        animating={animating}
      />
    </View>
  );
}
