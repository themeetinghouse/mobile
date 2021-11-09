import React from 'react';
import { View, Button, Text } from 'native-base';
import { ViewStyle, StyleSheet, ActivityIndicator } from 'react-native';
import Theme from '../../Theme.style';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.white,
    borderRadius: 0,
    height: '100%',
  },
  label: {
    color: Theme.colors.black,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
  },
  buttonBlack: {
    backgroundColor: 'black',
    borderRadius: 0,
    height: '100%',
  },
  labelBlack: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    height: '100%',
    borderWidth: 3,
    borderColor: 'white',
  },
  labelOutlined: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
  },
});

function getStyles(
  outlined: boolean | undefined,
  solidBlack: boolean | undefined
) {
  if (outlined) {
    return {
      buttonStyle: styles.buttonOutlined,
      labelStyle: styles.labelOutlined,
    };
  }

  if (solidBlack) {
    return {
      buttonStyle: styles.buttonBlack,
      labelStyle: styles.labelBlack,
    };
  }

  return {
    buttonStyle: styles.button,
    labelStyle: styles.label,
  };
}

interface Params {
  style?: ViewStyle;
  label: string;
  onPress?: () => void;
  outlined?: boolean;
  solidBlack?: boolean;
}

export default function WhiteButton({
  style,
  label,
  onPress,
  outlined,
  solidBlack,
}: Params): JSX.Element {
  const { buttonStyle, labelStyle } = getStyles(outlined, solidBlack);

  return (
    <View style={style}>
      <Button style={buttonStyle} onPress={onPress}>
        <Text style={labelStyle}>{label}</Text>
      </Button>
    </View>
  );
}

interface AsyncParams extends Params {
  isLoading: boolean;
}

export function WhiteButtonAsync({
  style,
  label,
  onPress,
  outlined,
  solidBlack,
  isLoading,
}: AsyncParams): JSX.Element {
  const { buttonStyle, labelStyle } = getStyles(outlined, solidBlack);

  return (
    <View style={style}>
      <Button disabled={isLoading} style={buttonStyle} onPress={onPress}>
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={labelStyle}>{label}</Text>
        )}
      </Button>
    </View>
  );
}
