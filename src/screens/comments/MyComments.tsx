import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
  TouchableHighlight,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import FallbackImage from '../../../src/components/FallbackImage';
import ToggleButton from '../../components/buttons/ToggleButton';
import SearchBar from '../../components/SearchBar';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { getCommentsByOwner } from '../../graphql/queries';
import { TMHCognitoUser } from '../../../src/contexts/UserContext';
import NotesService from '../../services/NotesService';
import { GetCommentsByOwnerQuery } from '../../services/API';
import ActivityIndicator from '../../components/ActivityIndicator';
import SeriesService from '../../../src/services/SeriesService';
import AllButton from '../../../src/components/buttons/AllButton';

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
    marginLeft: 18,
    borderBottomLeftRadius: 0,
    borderBottomWidth: 0.2,
    borderBottomColor: Theme.colors.gray3,
  },
  commentText: {
    paddingTop: 8,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 24,
    paddingRight: 16,
    fontSize: Theme.fonts.medium,
    paddingBottom: 8,
  },
  dateText: {
    marginTop: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.small,
    lineHeight: 18,
    color: Theme.colors.white,
  },
  sectionListHeaderContainer: {
    flex: 1,
    backgroundColor: Theme.colors.black,
    flexDirection: 'row',
    marginTop: 18,
    marginLeft: 18,
  },
  sectionListHeaderText: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 24,
    lineHeight: 32,
    marginRight: 8,
  },
  tagContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 6,
  },
  tagText: {
    marginBottom: 2,
    marginRight: 4,
    fontSize: Theme.fonts.small,
    lineHeight: 18,
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
    height: 26,
    color: Theme.colors.white,
    backgroundColor: Theme.colors.gray1,
  },
  seriesInfoText: {
    color: Theme.colors.gray5,
    fontSize: Theme.fonts.small,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 18,
    marginBottom: 15,
  },
  emptyListText: {
    marginLeft: 18,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 24,
    fontSize: Theme.fonts.medium,
  },
  seriesImage: {
    width: 80,
    height: 96,
    marginRight: 16,
  },
  listWrapper: {
    flex: 1,
    marginTop: 18,
  },
  spinnerStyle: {
    alignSelf: 'center',
    marginTop: 100,
    width: 50,
    height: 50,
  },
});

type SeriesInfo = {
  year: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeCount: number;
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

  // TODO: Implement pagination + search (the proper way?). Schema changes are required
  //        - Data needs to be presorted in order to allow for proper pagination with nextToken
  const [comments, setComments] = useState<RecentComments>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sectionList, setSectionList] = useState<BySeriesComments>([]);
  const [filterToggle, setFilterToggle] = useState(false);

  const loadSeriesData = async (userComments: RecentComments) => {
    const series: BySeriesComments = [];
    const tempComments = [...userComments];
    const noteIds: Array<string> = [];
    let doesExist;
    // Finds all unique noteIds
    for (let i = 0; i < userComments.length; i++) {
      if (userComments[i].comment?.noteId) {
        const noteLocation = noteIds.findIndex(
          (id) => id === userComments[i]?.comment?.noteId
        );
        if (noteLocation === -1) {
          noteIds.push(userComments[i]?.comment?.noteId ?? '');
        }
      }
    }
    // Iterates through noteIds to get note and series data
    for (let x = 0; x < noteIds.length; x++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const noteData = await NotesService.loadNotesNoContentCustom(
          noteIds[x]
        );
        // eslint-disable-next-line no-await-in-loop
        const episodeCount = await SeriesService.getSeriesEpisodeCount(
          noteData?.seriesId ?? ''
        );

        // Iterates through comments to set matching series data
        for (let z = 0; z < userComments.length; z++) {
          if (userComments[z].comment?.noteId === noteIds[x]) {
            tempComments[z] = {
              ...tempComments[z],
              seriesInfo: {
                year: noteData?.id ?? '',
                episodeNumber: noteData?.episodeNumber ?? 0,
                episodeTitle: noteData?.title ?? '',
                episodeCount,
              },
            };
            doesExist = series.findIndex((a) => a.title === noteData?.seriesId);
            if (doesExist !== -1) {
              series[doesExist].data.push(userComments[z]);
            } else {
              series.push({
                title: noteData?.seriesId as string,
                data: [userComments[z]],
                seriesInfo: {
                  year: noteData?.id ?? '',
                  episodeCount,
                  episodeNumber: noteData?.episodeNumber ?? 0,
                  episodeTitle: noteData?.title ?? '',
                },
              });
            }
          }
        }
      } catch (err) {
        console.debug(err);
      }
    }
    setComments(tempComments);
    setSectionList(series);
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
          limit: 2000,
        },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as GraphQLResult<GetCommentsByOwnerQuery>;

      if (json.data?.getCommentsByOwner?.items) {
        const commentData = json.data?.getCommentsByOwner?.items;
        const commentWithSeriesInfo = commentData.map((comment) => {
          return {
            comment,
            seriesInfo: {
              year: '',
              episodeNumber: 0,
              episodeTitle: '',
            },
          } as Comment;
        });
        if (commentWithSeriesInfo) {
          commentWithSeriesInfo.sort((a, b) => {
            if (a?.comment?.createdAt && b.comment?.createdAt)
              return b?.comment?.createdAt?.localeCompare(
                a?.comment?.createdAt
              );
            return 0;
          });
          await loadSeriesData(commentWithSeriesInfo);
        }
      }
    } catch (err) {
      console.debug(err);
    } finally {
      setIsLoading(false);
    }
  };
  const getSeriesImage = (title: string) => {
    return `https://themeetinghouse.com/cache/320/static/photos/series/adult-sunday-${title.replace(
      '?',
      ''
    )}.jpg`;
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openComment = ({ comment }: Comment) => {
    if (comment?.id && comment?.comment)
      navigation.push('CommentScreen', {
        commentId: comment?.id,
        comment: comment?.comment,
        tags: comment?.tags ?? [],
        commentType: comment?.commentType,
        imageUri: comment?.imageUri ?? undefined,
        textSnippet: comment?.textSnippet ?? undefined,
        noteId: comment?.noteId,
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
        <View style={style.tagContainer}>
          {item?.comment?.tags?.map((tag, index) => {
            return (
              <Text key={index.toString()} style={style.tagText}>
                {tag}
              </Text>
            );
          })}
        </View>
        {seriesInfo ? (
          <Text style={style.seriesInfoText}>
            E{seriesInfo.episodeNumber}, {seriesInfo.episodeTitle}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const CommentListByDate = () => {
    const [showCount, setShowCount] = useState(20);
    return (
      <View style={style.listWrapper}>
        <FlatList
          ListEmptyComponent={
            <View>
              <Text style={style.emptyListText}>No comments found</Text>
            </View>
          }
          ListFooterComponent={
            comments.length > showCount ? (
              <View style={{ marginBottom: 10 }}>
                <AllButton handlePress={() => setShowCount(showCount + 20)}>
                  Load More
                </AllButton>
              </View>
            ) : null
          }
          data={comments?.filter(
            ({ comment }) =>
              comment?.comment
                ?.toLowerCase()
                ?.includes(searchText.toLowerCase()) ||
              comment?.tags?.find((tag) =>
                tag?.toLowerCase()?.includes(searchText.toLowerCase())
              )
          )}
          renderItem={({ item, index }) => {
            if (index < showCount) return renderComment(item, item?.seriesInfo);
            return null;
          }}
          keyExtractor={(item) => {
            return item.comment?.id as string;
          }}
        />
      </View>
    );
  };

  const CommentListBySeries = () => {
    const [showCount, setShowCount] = useState(3);
    return (
      <View style={style.listWrapper}>
        <SectionList
          ListEmptyComponent={
            <View>
              <Text style={style.emptyListText}>No comments found</Text>
            </View>
          }
          sections={
            sectionList
              .map((section) => {
                const filtered = section.data.filter(
                  ({ comment }) =>
                    comment?.comment
                      ?.toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    comment?.tags?.find((tag) =>
                      tag?.toLowerCase()?.includes(searchText.toLowerCase())
                    )
                );
                if (filtered.length > 0)
                  return {
                    ...section,
                    data: filtered,
                  };
                return null;
              })
              .filter((section) => section !== null) as BySeriesComments
          }
          stickySectionHeadersEnabled={false}
          ListFooterComponent={
            sectionList.length > showCount ? (
              <View style={{ marginBottom: 10 }}>
                <AllButton handlePress={() => setShowCount(showCount + 3)}>
                  Load More
                </AllButton>
              </View>
            ) : null
          }
          keyExtractor={(item) => {
            return item?.comment?.id as string;
          }}
          extraData={searchText}
          renderItem={({ item, section: { seriesInfo } }) => {
            return <View>{renderComment(item, seriesInfo)}</View>;
          }}
          renderSectionHeader={({ section: { title, seriesInfo } }) => {
            return (
              <View style={style.sectionListHeaderContainer}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={style.sectionListHeaderText}>{title}</Text>
                  <Text style={[style.dateText, { color: Theme.colors.gray4 }]}>
                    {seriesInfo?.year.slice(0, 4)} • {seriesInfo.episodeCount}{' '}
                    Episodes
                  </Text>
                </View>

                <View
                  style={{
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
                    <FallbackImage
                      style={style.seriesImage}
                      uri={getSeriesImage(title)}
                      catchUri="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
                    />
                  </TouchableHighlight>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 12 }}>
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
      {isLoading ? (
        <ActivityIndicator animating={isLoading} style={style.spinnerStyle} />
      ) : !filterToggle ? (
        <CommentListByDate />
      ) : (
        <CommentListBySeries />
      )}
    </View>
  );
}
