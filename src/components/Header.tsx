import React from 'react';
import { View, StatusBar, Platform, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../Theme.style';

interface Props {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}

export default function Header({ children, style }: Props): JSX.Element {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor="#1a1a1a" />

      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: safeArea?.top,
            backgroundColor: '#1a1a1a',
          },
          style,
        ]}
      >
        {children}
      </View>
    </>
  );
}
