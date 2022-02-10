import React from 'react';
import {
  ViewStyle,
  ImageSourcePropType,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Theme from '../../Theme.style';

const style = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.grey2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonActive: {
    backgroundColor: Theme.colors.white,
  },

  label: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
  },

  labelActive: {
    color: Theme.colors.black,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 18,
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
    <TouchableOpacity
      onPress={onPress}
      style={[style.button, wrapperStyle, active ? style.buttonActive : {}]}
    >
      <Image
        accessibilityLabel="icon"
        source={active ? iconActive : iconInactive}
        style={style.icon}
      />
      <Text style={[style.label, active ? style.labelActive : {}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
