import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  SectionList,
} from 'react-native';
import React from 'react';
import SearchBar from '../../../src/components/SearchBar';
import SearchFilterButtons from './SearchFilterButtons';
import { SearchScreenProvider, useSearchContext } from './SearchContext';
import { SearchResult, SearchScreenActionType } from './SearchScreenTypes';
import SearchRecent from './SearchRecent';
import useSearch from '../../hooks/useSearch';
import SearchSerie from './SearchSerie';
import SearchComment from './SearchComment';
import SearchNote from './SearchNote';
import Theme from '../../Theme.style';
import SearchTeaching from './SearchTeaching';
import AllButton from '../../components/buttons/AllButton';

const SeparatorComponent = ({
  item,
  searchCategory,
  dispatch,
}: {
  item: any;
  searchCategory: string;
  dispatch: any;
}) => {
  let label = ``;
  if (searchCategory === 'Series & Sermons') label = 'Series & Sermons';
  else if (searchCategory === 'Notes') label = 'Notes';
  else if (searchCategory === 'My Comments') label = 'Comments';
  else label = 'Results';
  if (searchCategory !== 'Everything') return null;
  if (!item.leadingItem) return null;
  if (item.section.data.length < 9) return null;

  return (
    <AllButton
      onPress={() =>
        dispatch({
          type: SearchScreenActionType.SET_SEARCH_CATEGORY,
          payload: item.section.title,
        })
      }
    >
      {`More ${label}`}
    </AllButton>
  );
};
const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const shouldShow = (item: SearchResult, searchCategory: string) => {
  switch (item.searchResultType) {
    case 'sermons':
      return (
        searchCategory === 'Everything' || searchCategory === 'Series & Sermons'
      );
    case 'series':
      return (
        searchCategory === 'Everything' || searchCategory === 'Series & Sermons'
      );
    case 'comments':
      return (
        searchCategory === 'Everything' || searchCategory === 'My Comments'
      );
    case 'notes':
      return searchCategory === 'Everything' || searchCategory === 'Notes';
    default:
      return false;
  }
};

export const SearchItemRouter = ({ item }: { item: SearchResult }) => {
  const { searchResultType } = item;
  switch (searchResultType) {
    case 'sermons':
      return <SearchTeaching item={item} />;
    case 'series':
      return <SearchSerie item={item} />;
    case 'comments':
      return <SearchComment item={item} />;
    case 'notes':
      return <SearchNote item={item} />;
    default:
      return null;
  }
};

function Search() {
  const { state, dispatch } = useSearchContext();
  const handleTextChanged = (newText: string) => {
    dispatch({
      type: SearchScreenActionType.SET_SEARCH_TEXT,
      payload: newText,
    });
  };
  useSearch();
  const SeriesAndSermons = state.searchResults.filter((item) =>
    shouldShow(item, 'Series & Sermons')
  );
  const MyComments = state.searchResults.filter((item) =>
    shouldShow(item, 'My Comments')
  );
  const Notes = state.searchResults.filter((item) => shouldShow(item, 'Notes'));
  const sections = [
    {
      title: 'Series & Sermons',
      data:
        state.searchCategory === 'Everything'
          ? SeriesAndSermons.slice(0, 9)
          : SeriesAndSermons,
    },
    {
      title: 'My Comments',
      data:
        state.searchCategory === 'Everything'
          ? MyComments.slice(0, 9)
          : MyComments,
    },
    {
      title: 'Notes',
      data: state.searchCategory === 'Everything' ? Notes.slice(0, 9) : Notes,
    },
  ].filter(
    (section) =>
      (!state.isLoading &&
        section.data.length > 0 &&
        state.searchCategory === 'Everything') ||
      (!state.isLoading &&
        section.data.length > 0 &&
        state.searchCategory === section.title)
  );
  const emptySectionComponent = () => {
    let emptyLabel = ``;
    if (state.searchCategory === 'Series & Sermons')
      emptyLabel = 'series or sermons';
    else if (state.searchCategory === 'Notes') emptyLabel = 'notes';
    else if (state.searchCategory === 'My Comments') emptyLabel = 'comments';
    else emptyLabel = 'results';
    return !state.isLoading ? (
      <Text
        style={{
          color: '#FFF',
          fontFamily: Theme.fonts.fontFamilyBold,
          marginLeft: 16,
          marginTop: 24,
          marginBottom: 32,
        }}
      >
        No {emptyLabel} found
      </Text>
    ) : null;
  };
  return (
    <View style={Styles.Container}>
      <SearchBar
        style={{ marginLeft: 16, marginRight: 16, marginTop: 60 }}
        searchText={state.searchText}
        placeholderLabel="Search..."
        handleTextChanged={handleTextChanged}
      />
      {state.showRecent ? (
        <SearchRecent />
      ) : (
        <>
          <SearchFilterButtons />
          {state.isLoading ? (
            <ActivityIndicator style={{ alignSelf: 'center', marginTop: 60 }} />
          ) : null}
          <SectionList
            ListEmptyComponent={emptySectionComponent}
            SectionSeparatorComponent={(item) =>
              SeparatorComponent({
                item,
                searchCategory: state.searchCategory,
                dispatch,
              })
            }
            stickySectionHeadersEnabled={false}
            style={{ width: '100%' }}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={{
                  color: '#FFF',
                  fontFamily: Theme.fonts.fontFamilyBold,
                  marginLeft: 16,
                  marginTop: 24,
                  marginBottom: 32,
                }}
              >
                {title}
              </Text>
            )}
            sections={sections}
            renderItem={({ item }) => <SearchItemRouter item={item} />}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
}

export default function SearchScreen() {
  return (
    <SearchScreenProvider>
      <Search />
    </SearchScreenProvider>
  );
}
