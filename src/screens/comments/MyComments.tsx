/* eslint-disable no-nested-ternary */
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  SectionList,
  TouchableHighlight,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import ToggleButton from '../../components/buttons/ToggleButton';
import SearchBar from '../../components/SearchBar';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { getCommentsByOwner } from '../../graphql/queries';
import { TMHCognitoUser } from '../../../src/contexts/UserContext';
import NotesService from '../../services/NotesService';
import { GetCommentsByOwnerQuery } from '../../services/API';
import ActivityIndicator from '../../components/ActivityIndicator';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      padding: 16,
    },
  },
  header: Style.header,
  headerTitle: HeaderStyle.title,
  searchBar: {
    marginBottom: 16,
  },
  commentItem: {
    borderBottomLeftRadius: 0,
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },
  commentText: {
    paddingTop: 8,
    color: '#FFFFFF',
    fontFamily: 'Graphik-Regular-App',
    fontWeight: '400',
    lineHeight: 24,
    paddingRight: 16,
    fontSize: 16,
    paddingBottom: 8,
  },
  dateText: {
    marginTop: 16,
    fontFamily: 'Graphik-Regular-App',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  sectionListHeader: {
    color: 'white',
    fontFamily: 'Graphik-Bold-App',
    fontSize: 24,
    lineHeight: 32,
  },
});

type SeriesInfo = {
  year: string;
  episodeNumber: number;
  episodeTitle: string;
};
type RecentComments = Array<Comment>;

type Comment = {
  comment: NonNullable<
    NonNullable<
      NonNullable<GetCommentsByOwnerQuery['getCommentsByOwner']>
    >['items']
  >[0];
  seriesInfo: SeriesInfo;
};

type BySeriesComments = Array<{
  title: string;
  data: RecentComments;
  seriesInfo: SeriesInfo;
}>;

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

export default function MyComments({ navigation }: Params): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'My Comments',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingRight: 12,
              paddingBottom: 12,
              paddingTop: 12,
            }}
          >
            <Thumbnail
              square
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                transform: [{ translateX: -4 }],
              }}
            >
              More
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  // TODO: Variable name changes, improve clarity
  // TODO: Implement pagination + search (the proper way?). Schema changes are required
  //        - Data needs to be presorted in order to allow for proper pagination with nextToken
  // TODO: [Temporary fix has been applied] Bottom of flatlist is being clipped **
  // TODO: Fix types
  // TODO: Implement seriesInfo for FlatList comments array
  // TODO: Sort SectionList data by date within per section
  const [comments, setComments] = useState<RecentComments>([]);
  // TODO: Move isLoading to sectionList and comments
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [sectionList, setSectionList] = useState<BySeriesComments>([]);
  const [filterToggle, setFilterToggle] = useState(false);

  const loadSeriesData = async (userComments: RecentComments) => {
    const series: BySeriesComments = [];
    const tempComments = [...userComments];
    let doesExist;
    // TODO: Awaiting inside for loop increases loading time. Can this be improved?
    if (userComments)
      for (let i = 0; i < userComments.length; i++) {
        if (userComments[i].comment?.noteId) {
          // TODO: Missing try/catch
          // eslint-disable-next-line no-await-in-loop
          const seriesData = await NotesService.loadNotesNoContent(
            userComments[i]?.comment?.noteId as string
          );
          tempComments[i] = {
            ...tempComments[i],
            seriesInfo: {
              year: seriesData?.id ?? '',
              episodeNumber: seriesData?.episodeNumber ?? 0,
              episodeTitle: seriesData?.title ?? '',
            },
          };
          doesExist = series.findIndex((a) => a.title === seriesData?.seriesId);
          if (doesExist !== -1) {
            series[doesExist].data.push(userComments[i]);
          } else {
            series.push({
              title: seriesData?.seriesId as string,
              data: [userComments[i]],
              seriesInfo: {
                year: seriesData?.id ?? '2020',
                episodeNumber: seriesData?.episodeNumber ?? 0,
                episodeTitle: seriesData?.title ?? '',
              },
            });
          }
        }
      }
    setComments(tempComments);
    setSectionList(series);
    setIsLoading(false);
  };

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const cognitoUser: TMHCognitoUser = await Auth.currentAuthenticatedUser();
      const json = (await API.graphql({
        query: getCommentsByOwner,
        variables: {
          owner: cognitoUser.username,
          sortDirection: 'DESC',
          limit: 1000,
        },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as GraphQLResult<GetCommentsByOwnerQuery>;

      if (json.data?.getCommentsByOwner?.items) {
        const commentData = json.data?.getCommentsByOwner?.items;
        const transformed = commentData.map((comm) => {
          return {
            comment: comm,
            seriesInfo: {
              year: '',
              episodeNumber: 0,
              episodeTitle: '',
            },
          } as Comment;
        });
        if (transformed) {
          // TODO: Sort by createdAt
          await loadSeriesData(transformed);
        }
      }
    } catch (e) {
      // TODO: Sentry
      setIsLoading(false);
    }
  };
  const getSeriesImage = (title: string) => {
    return `https://themeetinghouse.com/cache/320/static/photos/series/adult-sunday-${title.replace(
      '?',
      ''
    )}.jpg`;
    // TODO: Implement fallback image
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openComment = (selectedComment: Comment) => {
    if (selectedComment?.comment?.id && selectedComment?.comment?.comment)
      navigation.push('CommentScreen', {
        commentId: selectedComment?.comment?.id,
        comment: selectedComment?.comment?.comment,
        tags: selectedComment?.comment?.tags ?? [],
        commentType: selectedComment?.comment?.commentType,
        imageUri: selectedComment?.comment?.imageUri ?? undefined,
        textSnippet: selectedComment?.comment?.textSnippet ?? undefined,
        noteId: selectedComment?.comment?.noteId,
      });
  };

  const renderComment = (
    item: Comment,
    seriesInfo: SeriesInfo
  ): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={() => openComment(item)}
        style={style.commentItem}
      >
        <Text style={style.dateText}>
          {item?.comment?.date} • {item?.comment?.time}
        </Text>
        <Text style={style.commentText}>{item?.comment?.comment}</Text>
        <View
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginRight: 6,
          }}
        >
          {item?.comment?.tags?.map((tag, index) => {
            return (
              <Text
                key={index.toString()}
                style={{
                  marginBottom: 2,
                  marginRight: 4,
                  fontSize: 12,
                  lineHeight: 18,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingHorizontal: 8,
                  height: 26,
                  color: 'white',
                  backgroundColor: '#1A1A1A',
                }}
              >
                {tag}
              </Text>
            );
          })}
        </View>
        {seriesInfo ? (
          <Text
            style={{
              color: '#C8C8C8',
              fontSize: 12,
              fontFamily: 'Graphik-Regular-App',
              lineHeight: 18,
              marginBottom: 15,
            }}
          >
            E{seriesInfo.episodeNumber}, {seriesInfo.episodeTitle}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={{ maxHeight: Dimensions.get('window').height - 200 }}>
        <FlatList
          style={{ marginTop: 18, marginLeft: 16 }}
          data={
            comments /* ?.filter(
            (comment) =>
              comment?.comment
                ?.toLowerCase()
                ?.includes(searchText.toLowerCase()) ||
              comment?.tags?.find((tag) =>
                tag?.toLowerCase()?.includes(searchText.toLowerCase())
              )
          ) */
          }
          renderItem={({ item }) => {
            return renderComment(item, item?.seriesInfo);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const renderSectionList = () => {
    return (
      <View style={{ maxHeight: Dimensions.get('window').height - 200 }}>
        <SectionList
          style={{ marginTop: 18, marginLeft: 16 }}
          sections={sectionList}
          keyExtractor={(item) => {
            return item?.comment?.id ?? '';
          }}
          renderItem={({ item, section: { seriesInfo } }) => {
            return <View>{renderComment(item, seriesInfo)}</View>;
          }}
          renderSectionHeader={({ section: { title, seriesInfo } }) => (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={style.sectionListHeader}>{title}</Text>
                <Text style={[style.dateText, { color: '#646469' }]}>
                  {seriesInfo?.year.slice(0, 4)} • # Episodes
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <TouchableHighlight
                  onPress={() =>
                    navigation.push('Main', {
                      screen: 'Teaching',
                      params: {
                        screen: 'SeriesLandingScreen',
                        params: { seriesId: title },
                      },
                    })
                  }
                >
                  <Thumbnail
                    square
                    style={{ width: 80, height: 96, marginRight: 16 }}
                    source={{ uri: getSeriesImage(title) }}
                  />
                </TouchableHighlight>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  const renderActivityIndicator = () => {
    return (
      <ActivityIndicator
        animating={isLoading}
        style={{
          alignSelf: 'center',
          marginTop: 100,
          width: 50,
          height: 50,
        }}
      />
    );
  };

  return (
    <View style={{ marginTop: 12 }}>
      <SearchBar
        style={{ marginHorizontal: 16, marginBottom: 18.5 }}
        handleTextChanged={(newStr) => setSearchText(newStr)}
        searchText={searchText}
        placeholderLabel="Search"
      />
      <ToggleButton
        toggle={(current: boolean) => setFilterToggle(current)}
        currentToggle={filterToggle}
        btnTextOne="Most Recent"
        btnTextTwo="By Series"
      />
      {isLoading
        ? renderActivityIndicator()
        : !filterToggle
        ? renderFlatList()
        : renderSectionList()}
    </View>
  );
}
