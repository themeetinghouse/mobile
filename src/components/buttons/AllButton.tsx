import React from 'react';
import {
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  Image,
} from 'react-native';

import { Theme } from '../../Theme.style';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.black,
    borderColor: Theme.colors.gray2,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 20,
    paddingLeft: 16,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.medium,
    flex: 1,
    color: Theme.colors.white,
  },
  icon: {
    width: Theme.icons.width,
    height: Theme.icons.height,
  },
});

type Params = {
  style?: TouchableOpacityProps['style'];
  children: string;
  handlePress?(): void;
  icon?: ImageSourcePropType;
};

export default function AllButton({
  style,
  children,
  handlePress,
  icon,
}: Params): JSX.Element {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.text}>{children}</Text>

      <Image source={icon ?? Theme.icons.white.arrow} style={styles.icon} />
    </TouchableOpacity>
  );
}
