import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Comment } from 'src/services/API';
import Theme from '../../Theme.style';
import { useSearchContext } from './SearchContext';
import {
  CommentResult,
  SearchResult,
  SearchScreenActionType,
} from './SearchScreenTypes';

const Styles = StyleSheet.create({
  Container: {
    padding: 16,
    flexDirection: 'row',
    flex: 1,
  },
  SubContainer: {
    flexDirection: 'column',
    flex: 1,
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
  },
  CommentText: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 26,
    color: '#FFF',
    marginTop: 8,
    fontSize: 16,
  },
  HighlightedText: {
    color: 'white',
    backgroundColor: '#FF595A',
  },
});

export const CropAndHighlightText = ({
  text,
  keyword,
}: {
  text?: string;
  keyword?: string;
}) => {
  if (!text || !keyword)
    return (
      <Text numberOfLines={4} style={Styles.CommentText}>
        {text}
      </Text>
    );
  let startOfSearchedTerm = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (
    startOfSearchedTerm - text.slice(startOfSearchedTerm, text.length).length <
    60
  ) {
    startOfSearchedTerm = 0;
  }
  const words = text.slice(startOfSearchedTerm, text.length).split(' ');
  const buildElement = words.map((word, index) => {
    return (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={index + word}>
        <Text
          numberOfLines={1}
          style={[
            Styles.CommentText,
            keyword.toLowerCase().includes(word.toLowerCase()) ||
            word.toLowerCase() === keyword.toLowerCase()
              ? Styles.HighlightedText
              : {},
          ]}
        >
          {word}
        </Text>
        <Text> </Text>
      </React.Fragment>
    );
  });
  return (
    <Text style={Styles.CommentText} numberOfLines={4}>
      {buildElement}
    </Text>
  );
};
export default function SearchComment({ item }: { item: CommentResult }) {
  const { dispatch, state } = useSearchContext();
  const navigation = useNavigation();
  const handleCommentPress = () => {
    dispatch({
      type: SearchScreenActionType.SET_RECENT_SEARCHES,
      payload: item,
    });
    navigation.navigate('CommentScreen', {
      callback: (updatedComment: Comment) => {
        const searchResultComment = updatedComment as SearchResult;
        searchResultComment.searchResultType = 'comments';
        dispatch({
          type: SearchScreenActionType.SET_RECENT_SEARCHES,
          payload: searchResultComment,
        });
        dispatch({
          type: SearchScreenActionType.UPDATE_COMMENT_SEARCH_RESULTS,
          payload: searchResultComment,
        });
      },
      commentId: item?.id,
      comment: item?.comment,
      tags: item?.tags ?? [],
      commentType: item?.commentType,
      imageUri: item?.imageUri ?? undefined,
      textSnippet: item?.textSnippet ?? undefined,
      noteId: item?.noteId,
    });
    // navigation.navigate('Teaching', {
    //   screen: 'SeriesLandingScreen',
    //   params: { item },
    // });
  };
  return (
    <TouchableOpacity onPress={handleCommentPress} style={Styles.Container}>
      <Image style={Styles.Image} source={Theme.icons.grey.comments} />
      <View style={Styles.SubContainer}>
        <Text style={Styles.CommentDate}>
          {item.date} • {item.time}
        </Text>
        <CropAndHighlightText text={item.comment} keyword={state.searchText} />
      </View>
    </TouchableOpacity>
  );
}
