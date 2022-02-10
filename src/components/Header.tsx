import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../Theme.style';

interface Props {
  children: React.ReactNode;
}

export default function Header({ children }: Props): JSX.Element {
  const safeArea = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <>
      {Platform.OS === 'android' ? (
        <StatusBar backgroundColor="#111111" />
      ) : null}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: safeArea?.top + 12,
          paddingBottom: 2,
          paddingRight: 16,
          backgroundColor: Theme.colors.background,
          borderBottomColor: '#414141',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        {children}
      </View>
    </>
  );
}
