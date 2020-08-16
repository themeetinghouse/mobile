import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen(): JSX.Element {
  return <View><Text>Settings (to-do)</Text></View>;
}

SettingsScreen.navigationOptions = {
  title: 'app.json',
};
