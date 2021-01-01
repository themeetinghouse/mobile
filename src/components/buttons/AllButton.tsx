import React from 'react';
import { Button, Right, Text, Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style';
import { StyleSheet } from 'react-native';
import { ImageSourcePropType } from 'react-native';

const style = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.black,
    borderColor: Theme.colors.gray2,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    height: 63,
  },
  text: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.medium,
  },
  icon: {
    width: Theme.icons.width,
    height: Theme.icons.height,
    marginRight: 15,
  },
});

type Params = {
  children: string;
  handlePress?(): any;
  icon?: ImageSourcePropType;
};

export default function AllButton({
  children,
  handlePress,
  icon,
}: Params): JSX.Element {
  return (
    <Button full iconRight style={style.button} onPress={handlePress}>
      <Text uppercase={false} style={style.text}>
        {children}
      </Text>
      <Right>
        <Thumbnail
          square
          source={icon ?? Theme.icons.white.arrow}
          style={style.icon}
        ></Thumbnail>
      </Right>
    </Button>
  );
}
