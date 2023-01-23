import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Theme from '../../Theme.style';
import { useSearchContext } from './SearchContext';
import { SearchScreenActionType, SeriesResult } from './SearchScreenTypes';

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
export default function SearchSerie({ item }: { item: SeriesResult }) {
  const { dispatch } = useSearchContext();
  const navigation = useNavigation();
  const handleSeriePress = () => {
    dispatch({
      type: SearchScreenActionType.SET_RECENT_SEARCHES,
      payload: item,
    });
    navigation.navigate('Teaching', {
      screen: 'SeriesLandingScreen',
      params: { item },
    });
  };
  return (
    <TouchableOpacity onPress={handleSeriePress} style={Styles.Container}>
      <Image style={Styles.Image} source={Theme.icons.grey.teaching} />
      <View style={Styles.SubContainer}>
        <Text style={Styles.Title}>{item.id}</Text>
        <Text style={Styles.Episode}>
          {moment(item.startDate).year()} &bull; {item.videos?.items?.length}
          {item.videos?.items?.length === 1 ? ' episode' : ' episodes'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
