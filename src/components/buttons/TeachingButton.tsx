import React from 'react';
import { View, Button, Text, Thumbnail } from 'native-base';
import { ViewStyle, ImageSourcePropType, StyleSheet } from 'react-native';
import Theme from '../../Theme.style';

const style = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.white,
    borderRadius: 0,
    height: '100%',
  },
  label: {
    color: Theme.colors.black,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    paddingRight: 0,
    paddingTop: 4,
  },
  buttonInactive: {
    backgroundColor: Theme.colors.grey2,
    borderRadius: 0,
    height: '100%',
  },
  labelInactive: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    paddingRight: 0,
    paddingTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

interface Params {
  wrapperStyle?: ViewStyle;
  label: string;
  onPress?: () => void;
  active: boolean;
  iconActive: ImageSourcePropType;
  iconInactive: ImageSourcePropType;
}

export default function TeachingButton({
  wrapperStyle,
  label,
  onPress,
  active,
  iconActive,
  iconInactive,
}: Params): JSX.Element {
  return (
    <View style={wrapperStyle}>
      <Button
        style={active ? style.button : style.buttonInactive}
        block
        onPress={onPress}
      >
        <Thumbnail
          square
          source={active ? iconActive : iconInactive}
          style={style.icon}
        />
        <Text
          style={active ? style.label : style.labelInactive}
          uppercase={false}
        >
          {label}
        </Text>
      </Button>
    </View>
  );
}
