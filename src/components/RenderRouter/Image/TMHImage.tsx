import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { FeaturedStackParamList } from 'src/navigation/MainTabNavigator';
import { ImageType } from '../ContentTypes';

const styles = StyleSheet.create({
  image: {
    height: 200,
  },
});
export default function TMHImage({ item }: { item: ImageType }) {
  const imageStyle =
    item.style === 'full' ? { marginLeft: 0 } : { marginLeft: 16 };
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
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!item?.navigateTo}
    >
      <Image
        style={[styles.image, imageStyle]}
        resizeMode="cover"
        source={{ uri: item.imageUrl }}
      />
    </TouchableOpacity>
  );
}
