import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import Theme, { Style } from '../../Theme.style';
import AllButton from '../buttons/AllButton';

const style = StyleSheet.create({
  homeChurchContainer: {
    backgroundColor: Theme.colors.black,
  },
  categoryTitle: {
    ...Style.categoryTitle,
    marginBottom: 0,
    paddingBottom: 0,
  },
  imageContainer: {
    height: 256,
    flex: 1,
  },
  picture: {
    marginLeft: 16,
    marginVertical: 0,
    paddingVertical: 0,
    flex: 1,
  },
  title: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 24,
    lineHeight: 32,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  paragraph: {
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 16,
    marginBottom: 24,
  },
});

export default function HomeChurchCard(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  return (
    <View style={style.homeChurchContainer}>
      <Text style={style.categoryTitle}>Home Church</Text>
      <View style={style.imageContainer}>
        <Image
          resizeMode="contain"
          style={style.picture}
          accessibilityLabel="Home Church Image"
          source={{
            uri:
              'https://www.themeetinghouse.com/static/images/homechurch-2-1.jpg',
            cache: 'default',
          }}
        />
      </View>
      <Text style={style.title}>Get connected to community near you.</Text>
      <Text style={style.paragraph}>
        It’s pretty simple: we get together each week to hang out, build
        relationships, and find ways to love and serve our local communities, as
        we learn to follow Jesus.
      </Text>
      <AllButton
        handlePress={() => navigation.navigate('HomeChurchScreen', {})}
      >
        Find a Home Church
      </AllButton>
    </View>
  );
}
