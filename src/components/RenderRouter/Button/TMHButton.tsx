import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FeaturedStackParamList } from 'src/navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import IconButton from '../../buttons/IconButton';
import AllButton from '../../buttons/AllButton';
import { ButtonType } from '../ContentTypes';
import WhiteButton from '../../buttons/WhiteButton';
import { useContentContext } from '../../../contexts/ContentScreenContext/ContentScreenContext';

const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: 16,
    height: 56,
  },
  whiteAllButtonStyle: {
    backgroundColor: '#fff',
  },
  whiteAllButtonLabelStyle: {
    color: '#000',
  },
  whiteOutlineButtonStyle: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  blackOutlineButtonStyle: {
    borderColor: '#fff',
    backgroundColor: '#000',
  },
});
export default function TMHButton({ item }: { item: ButtonType }) {
  const { state } = useContentContext();
  const { backgroundColor } = state;
  const navigation =
    useNavigation<StackNavigationProp<FeaturedStackParamList>>();
  const handlePress = () => {
    const isUrl =
      item.navigateTo?.includes('https://') ||
      item.navigateTo?.includes('http://') ||
      item.navigateTo?.includes('www.');
    if (!item.navigateTo) {
      navigation.goBack();
    } else if (isUrl) {
      Linking.openURL(item.navigateTo);
    } else navigation.push('ContentScreen', { screen: item.navigateTo });
  };
  switch (item.style) {
    case 'white-with-arrow':
      return (
        <AllButton type="white" handlePress={handlePress}>
          {item.label}
        </AllButton>
      );
    case 'black-with-arrow':
      return (
        <AllButton type="black" handlePress={handlePress}>
          {item.label}
        </AllButton>
      );
    case 'white': {
      const bttStyle = { borderWidth: backgroundColor === 'white' ? 3 : 0 };
      return (
        <WhiteButton
          outlined={false}
          label={item.label}
          style={[styles.buttonStyle, styles.whiteOutlineButtonStyle, bttStyle]}
          onPress={handlePress}
        />
      );
    }
    case 'black': {
      const isBlack = {
        borderWidth: backgroundColor === 'white' ? 0 : 3,
        borderColor: '#fff',
      };
      return (
        <WhiteButton
          solidBlack
          label={item.label}
          style={[styles.buttonStyle, styles.blackOutlineButtonStyle, isBlack]}
          onPress={handlePress}
        />
      );
    }
    case 'white-link-with-icon':
      return (
        <IconButton
          icon={{
            uri: item.icon,
          }}
          style={{ marginLeft: 16 }}
          label={item.label}
          onPress={handlePress}
        />
      );
    default:
      return null;
  }
}
