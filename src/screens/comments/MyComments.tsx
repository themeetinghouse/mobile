import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { StyleSheet, View, Text, FlatList } from 'react-native';
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
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}
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
  const [searchText, setSearchText] = useState('');
  const [filterToggle, setFilterToggle] = useState(false);
  // TODO: SectionList for "By Series" filtering
  // TODO: Bottom of flatlist is being clipped
  // TODO: Implement search (the proper way?)
  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await NotesService.loadNotesNoContent('2021-02-14');
    };
    fetchNotes();
    const loadComments = async () => {
      try {
        const cognitoUser: TMHCognitoUser = await Auth.currentAuthenticatedUser();
        const json = (await API.graphql({
          query: getCommentsByOwner,
          variables: { owner: cognitoUser.username, sortDirection: 'DESC' },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        })) as GraphQLResult<GetCommentsByOwnerQuery>;

        if (json.data?.getCommentsByOwner?.items) {
          // TODO: Fix types here
          const sorted = json.data?.getCommentsByOwner?.items.sort(
            (a: any, b: any) => b?.createdAt.localeCompare(a?.createdAt)
          );
          if (sorted) setComments(sorted);
        }
      } catch (e) {
        console.debug(e);
      }
    };
    loadComments();
  }, []);
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
        <FlatList
          style={{ marginTop: 18, marginLeft: 16 }}
          data={comments?.filter(
            (comment) =>
              comment?.comment
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              comment?.tags?.find((tag) =>
                tag?.toLocaleLowerCase()?.includes(searchText.toLowerCase())
              )
          )}
          renderItem={({ item }) => {
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
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
}