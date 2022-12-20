import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
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
    flexDirection: 'row',
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
  accessibilityHint?: string;
}

export default function IconButton({
  style,
  labelStyle,
  onPress,
  icon,
  label,
  rightArrow,
  disabled,
  accessibilityHint,
}: Props): JSX.Element {
  return (
    <TouchableOpacity
      disabled={!!disabled}
      style={[buttonStyle.button, style]}
      onPress={onPress}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon && (
        <Image
          accessibilityLabel="icon"
          source={icon}
          style={[
            Style.icon,
            buttonStyle.icon,
            disabled ? { opacity: 0.5 } : {},
          ]}
        />
      )}

      <Text
        style={[
          buttonStyle.label,
          (style && labelStyle) || {},
          disabled ? { opacity: 0.5 } : {},
        ]}
      >
        {label}
      </Text>
      <View style={{ flex: 1 }} />
      {rightArrow && (
        <Image
          accessibilityLabel="Right Arrow"
          source={Theme.icons.white.arrow}
          style={buttonStyle.iconRight}
        />
      )}
    </TouchableOpacity>
  );
}
