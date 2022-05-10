import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Theme from '../../../Theme.style';
import { TMHLogoType } from '../ContentTypes';

const LogoStyle = StyleSheet.create({
  logo: {
    marginLeft: 16,
    width: 164.15,
    height: 64.05,
  },
  centered: {
    alignSelf: 'center',
    marginLeft: 0,
  },
});

export default function TMHLogo({ item }: { item: TMHLogoType }) {
  return (
    <Image
      style={[LogoStyle.logo, item.centered && LogoStyle.centered]}
      source={Theme.icons[item.style].tmhlogo}
    />
  );
}
