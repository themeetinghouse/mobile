import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Theme from '../../Theme.style';
import { useSearchContext } from './SearchContext';
import { SearchScreenActionType, SermonsResult } from './SearchScreenTypes';

const Styles = StyleSheet.create({
  Container: {
    padding: 16,
    paddingLeft: 0,
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginLeft: 16,
    width: '100%',
    borderBottomColor: '#1A1A1A',
  },
  SubContainer: {
    flexDirection: 'column',
  },
  Image: {
    marginRight: 16,
    width: 22,
    height: 20,
  },
  Episode: {
    color: '#C8C8C8',
    fontSize: 12,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 18,
  },
  Title: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 24,
    color: '#FFF',

    fontSize: 16,
  },
});
export default function SearchTeaching({ item }: { item: SermonsResult }) {
  const { dispatch } = useSearchContext();
  const navigation = useNavigation();
  const handleTeachingPress = () => {
    dispatch({
      type: SearchScreenActionType.SET_RECENT_SEARCHES,
      payload: item,
    });
    navigation.navigate('SermonLandingScreen', { item });
  };
  if (!item.episodeTitle) return null;
  return (
    <TouchableOpacity onPress={handleTeachingPress} style={Styles.Container}>
      <Image style={Styles.Image} source={Theme.icons.grey.teaching} />
      <View style={Styles.SubContainer}>
        <Text style={Styles.Title}>{item.episodeTitle}</Text>
        <Text style={Styles.Episode}>
          {item.episodeNumber && item.seriesTitle
            ? `E${item.episodeNumber}, ${item.seriesTitle}`
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
