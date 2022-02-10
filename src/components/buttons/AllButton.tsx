import React from 'react';
import {
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

import { Theme } from '../../Theme.style';

const style = StyleSheet.create({
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
  children: string;
  handlePress?(): void;
  icon?: ImageSourcePropType;
};

export default function AllButton({
  children,
  handlePress,
  icon,
}: Params): JSX.Element {
  return (
    <TouchableOpacity style={style.button} onPress={handlePress}>
      <Text style={style.text}>{children}</Text>

      <Image source={icon ?? Theme.icons.white.arrow} style={style.icon} />
    </TouchableOpacity>
  );
}
