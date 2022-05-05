import { Text, StyleSheet } from 'react-native';
import React from 'react';
import Theme from '../../../../Theme.style';
import { BodyType } from '../../ContentTypes';
import { useContentContext } from '../../../../../src/contexts/ContentScreenContext/ContentScreenContext';

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
  const { state } = useContentContext();
  const { fontColor } = state;
  let style = item?.bold ? { ...TextBodyStyles.bold } : {};
  style = { ...TextBodyStyles[item.style], color: fontColor, ...style };
  return <Text style={style}>{item.text}</Text>;
}
