import React from 'react';
import { View, Image, Text } from 'native-base';
import {
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme, Style } from '../../Theme.style';

const buttonStyle = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: Theme.colors.transparent,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 0,
  },
  iconRight: {
    width: Theme.icons.width,
    height: Theme.icons.height,
    marginRight: 15,
  },
  label: {
    borderBottomColor: Theme.colors.white,
    borderBottomWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
    marginLeft: 15,
    marginRight: 15,
    color: Theme.colors.white,
  },
});

interface Props {
  style?: ViewStyle;
  labelStyle?: TextStyle;
  onPress?: () => void;
  icon?: ImageSourcePropType;
  label: string;
  rightArrow?: boolean;
  disabled?: boolean;
}

export default function IconButton({
  style,
  labelStyle,
  onPress,
  icon,
  label,
  rightArrow,
  disabled,
}: Props): JSX.Element {
  return (
    <View style={[buttonStyle.container, style]}>
      <TouchableOpacity
        disabled={!!disabled}
        style={buttonStyle.button}
        onPress={onPress}
      >
        {icon && (
          <Image
            alt="icon"
            source={icon}
            style={[
              Style.icon,
              buttonStyle.icon,
              disabled ? { opacity: 0.5 } : {},
            ]}
          />
        )}
        <View>
          <Text
            style={[
              buttonStyle.label,
              (style && labelStyle) || {},
              disabled ? { opacity: 0.5 } : {},
            ]}
          >
            {label}
          </Text>
        </View>
        {rightArrow && (
          <Image
            alt="right arrow icon"
            source={Theme.icons.white.arrow}
            style={buttonStyle.iconRight}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
