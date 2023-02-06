import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Theme from '../../Theme.style';
import { useSearchContext } from './SearchContext';
import { NotesResult, SearchScreenActionType } from './SearchScreenTypes';

const Styles = StyleSheet.create({
  Container: {
    padding: 16,
    flexDirection: 'row',
  },
  SubContainer: {
    flexDirection: 'column',
  },
  Image: {
    marginRight: 16,
    width: 22,
    height: 20,
  },
  CommentDate: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 18,
  },
  CommentText: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 24,
    color: '#FFF',
    fontSize: 16,
  },
});
export default function SearchNote({ item }: { item: NotesResult }) {
  const navigation = useNavigation();
  const { dispatch } = useSearchContext();
  const handlePress = () => {
    dispatch({
      type: SearchScreenActionType.SET_RECENT_SEARCHES,
      payload: item,
    });
    navigation.navigate('NotesScreen', { date: item.id });
  };
  return (
    <TouchableOpacity style={Styles.Container} onPress={handlePress}>
      <Image style={Styles.Image} source={Theme.icons.grey.notes} />
      <View style={Styles.SubContainer}>
        <Text numberOfLines={5} style={Styles.CommentText}>
          {item?.title}
        </Text>
        <Text numberOfLines={1} style={Styles.CommentDate}>
          {item?.seriesId} &bull; E{item?.episodeNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
