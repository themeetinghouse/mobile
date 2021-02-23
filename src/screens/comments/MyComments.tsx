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
import { getSeries } from 'src/services/queries';
// import AllButton from '../../components/buttons/AllButton';

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

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}
type Series = Array<{
  title: string;
  data: Array<CommentData>;
}>;
type CommentData = NonNullable<
  NonNullable<GetCommentsByOwnerQuery['getCommentsByOwner']>
>['items'];
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
  const [comments, setComments] = useState<CommentData>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [sectionList, setSectionList] = useState<Series>([]);
  const [filterToggle, setFilterToggle] = useState(false);
  // TODO: Fix types
  // TODO: [Temporary fix has been applied] Bottom of flatlist is being clipped **
  // TODO: Implement pagination + search (the proper way?). Schema changes are required
  //        - Data needs to be presorted in order to allow for proper pagination with nextToken
  const loadComments = async () => {
    try {
      const cognitoUser: TMHCognitoUser = await Auth.currentAuthenticatedUser();
      const json = (await API.graphql({
        query: getCommentsByOwner,
        variables: {
          owner: cognitoUser.username,
          sortDirection: 'DESC',
          limit: 1000,
          nextToken,
        },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as GraphQLResult<GetCommentsByOwnerQuery>;

      if (json.data?.getCommentsByOwner?.items) {
        // TODO: Fix types here
        const sorted = json.data?.getCommentsByOwner?.items.sort(
          (a: any, b: any) => b?.createdAt.localeCompare(a?.createdAt)
        );
        if (sorted) {
          setComments(sorted);
          setNextToken(json.data.getCommentsByOwner.nextToken);
        }
      }
    } catch (e) {
      console.debug(e);
    }
  };
  const getSeriesImage = (title: string) => {
    return `https://themeetinghouse.com/cache/320/static/photos/series/adult-sunday-${title.replace(
      '?',
      ''
    )}.jpg`;
    /*     let imageUri = `https://themeetinghouse.com/cache/640/static/photos/series/adult-sunday-${title.replace(
      '?',
      ''
    )}.jpg`;
    let imageUri = `https://www.themeetinghouse.com/static/photos/series/baby-hero/adult-sunday-${title.replace(
      / /g,
      '%20'
    )}.jpg`; */
  };
  const loadSeriesData = async () => {
    const series: Series = [];
    let doesExist;
    // TODO: Awaiting inside for loop increases loading time. Can this be improved?
    if (comments)
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]?.noteId) {
          // TODO: Missing try/catch
          // eslint-disable-next-line no-await-in-loop
          const seriesData = await NotesService.loadNotesNoContent(
            comments[i]?.noteId as string
          );
          doesExist = series.findIndex((a) => a.title === seriesData?.seriesId);
          if (doesExist !== -1) {
            series[doesExist].data.push(comments[i] as CommentData);
          } else {
            series.push({
              title: seriesData?.seriesId as string,
              data: [comments[i] as CommentData],
            });
          }
        }
      }
    setSectionList(series);
  };
  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    loadSeriesData();
  }, [comments]);

  const renderComment = (item: CommentData): JSX.Element => {
    return (
      <View style={style.commentItem}>
        <Text style={style.dateText}>
          {item?.date} • {item?.time}
        </Text>
        <Text style={style.commentText}>{item?.comment}</Text>
        <View
          style={{
            marginBottom: 14,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginRight: 6,
          }}
        >
          {item?.tags?.map((tag, index) => {
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
      </View>
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
      {!filterToggle ? (
        <View style={{ maxHeight: Dimensions.get('window').height - 200 }}>
          <FlatList
            /*  ListFooterComponent={
              <View style={{ marginBottom: 10 }}>
                <AllButton handlePress={() => loadComments()}>
                  Load More
                </AllButton>
              </View>
            } */
            style={{ marginTop: 18, marginLeft: 16 }}
            data={comments?.filter(
              (comment) =>
                comment?.comment
                  ?.toLowerCase()
                  ?.includes(searchText.toLowerCase()) ||
                comment?.tags?.find((tag) =>
                  tag?.toLowerCase()?.includes(searchText.toLowerCase())
                )
            )}
            renderItem={({ item }) => {
              return renderComment(item);
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <View style={{ maxHeight: Dimensions.get('window').height - 200 }}>
          <SectionList
            style={{ marginTop: 18, marginLeft: 16 }}
            sections={sectionList}
            keyExtractor={(item: CommentData) => {
              return item?.id;
            }}
            renderItem={({ item }: any) => {
              return renderComment(item);
            }}
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={style.sectionListHeader}>{title}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Thumbnail
                    square
                    style={{ width: 80, height: 96, marginRight: 16 }}
                    source={{ uri: getSeriesImage(title) }}
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
