import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { Theme } from '../../Theme.style';

interface Props {
  message: string;
  onPress: () => void;
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.yellow,
    padding: 16,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    lineHeight: 2,
    zIndex: 1,
  },
  message: {
    color: Theme.colors.black,
    fontSize: 16,
    fontFamily: Theme.fonts.fontFamilyMedium,
    fontWeight: 'normal',
    lineHeight: 24,
  },
});

export default function AnnouncementBar({
  message,
  onPress,
}: Props): JSX.Element {
  return (
    <TouchableOpacity style={style.container} onPress={onPress}>
      <Text style={style.message}>{message}</Text>
    </TouchableOpacity>
  );
}
