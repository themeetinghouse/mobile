import { Text, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import Theme from '../../../../Theme.style';
import { ScreenConfig, BodyType } from '../../ContentTypes';
import { ContentThemeContext } from '../../ContentScreen';

const TextBodyStyles = StyleSheet.create({
  large: {
    marginHorizontal: 16,
    fontFamily: Theme.fonts.fontFamilyRegular, // this should be weight 300, not existing atm
    fontSize: 20,
    lineHeight: 32,
  },
  medium: {
    marginHorizontal: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    marginHorizontal: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 18,
  },
  bold: {
    fontFamily: Theme.fonts.fontFamilyBold,
  },
});

export default function TextBody({ item }: { item: BodyType }) {
  const { fontColor } = useContext(ContentThemeContext);
  let style = item?.bold ? { ...TextBodyStyles.bold } : {};
  style = { ...TextBodyStyles[item.style], color: fontColor, ...style };
  return <Text style={style}>{item.text}</Text>;
}
