import React, { useContext } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FeaturedStackParamList } from 'src/navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AllButton from '../../../../../src/components/buttons/AllButton';
import { ButtonType } from '../../ContentTypes';
import WhiteButton from '../../../../../src/components/buttons/WhiteButton';
import { ContentThemeContext } from '../../ContentScreen';

const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: 16,
    height: 56,
    borderWidth: 5,
    borderColor: '#000',
  },
});
export default function Button({ item }: { item: ButtonType }) {
  const { backgroundColor } = useContext(ContentThemeContext);
  const navigation =
    useNavigation<StackNavigationProp<FeaturedStackParamList>>();
  const handlePress = () => {
    const isUrl =
      item.navigateTo?.includes('https://') ||
      item.navigateTo?.includes('http://') ||
      item.navigateTo?.includes('www.');
    if (!item.navigateTo) {
      navigation.push('ContentScreen', {
        screen: 'non existing',
      });
    } else if (isUrl) {
      if (isUrl) Linking.openURL(item.navigateTo);
      else navigation.push('ContentScreen', { screen: item.navigateTo });
    }
  };
  switch (item.style) {
    case 'withArrow':
      return (
        <AllButton
          style={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          handlePress={handlePress}
        >
          {item.label}
        </AllButton>
      );
    case 'white':
      return (
        <WhiteButton
          outlined={false}
          label={item.label}
          style={styles.buttonStyle}
          onPress={handlePress}
        />
      );
    case 'black':
      return (
        <WhiteButton
          outlined
          label={item.label}
          style={styles.buttonStyle}
          onPress={handlePress}
        />
      );
    default:
      return <></>;
  }
}
