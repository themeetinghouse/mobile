import React from 'react';
import { ScrollView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from 'aws-amplify';
import SearchTags from './SearchTags';
import Theme from '../../../src/Theme.style';
import { SearchItemRouter } from './SearchScreen';
import { useSearchContext } from './SearchContext';
import { SearchResult, SearchScreenActionType } from './SearchScreenTypes';

const getUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return Boolean(user);
  } catch (error) {
    console.error({ error });
    return false;
  }
};

export default function SearchRecent() {
  const { dispatch, state } = useSearchContext();
  React.useEffect(
    function loadRecentSearchItems() {
      (async function fetchRecentSearchItems() {
        const recentSearchItemsString = await AsyncStorage.getItem(
          'recentSearches'
        );
        const parsedRecentSearches = JSON.parse(
          recentSearchItemsString ?? '[]'
        );
        const isAuthenticated = await getUser();
        const filtered = parsedRecentSearches.filter(
          (searchItem: SearchResult) =>
            isAuthenticated || searchItem.searchResultType !== 'comments'
        );

        console.log({ filtered });
        const lastSearchUpdate =
          (await AsyncStorage.getItem('lastSearchUpdate')) ??
          new Date().toISOString().split('T')[0];
        const today = new Date();
        const lastUpdate = new Date(lastSearchUpdate);
        const dateDifference = today.getTime() - lastUpdate.getTime();
        const daysElapsed = Math.floor(dateDifference / (1000 * 3600 * 24));
        if (daysElapsed > 7) {
          console.log(
            `${daysElapsed} days have passed since last update. Clearing recent searches.`
          );
          await AsyncStorage.removeItem('recentSearches');
          await AsyncStorage.setItem('lastSearchUpdate', today.toISOString());
          return;
        }
        if (recentSearchItemsString) {
          dispatch({
            type: SearchScreenActionType.SET_INITIAL_RECENT_SEARCHES,
            payload: filtered,
          });
        }
      })();
    },
    [dispatch]
  );
  console.log({ searchRecentState: state });
  return (
    <>
      <SearchTags />
      {state.recentSearches?.length ? (
        <>
          <Text
            style={{
              color: 'white',
              marginLeft: 16,
              marginTop: 24,
              marginBottom: 24,
              letterSpacing: 0.5,
              fontSize: 14,
              fontFamily: Theme.fonts.fontFamilyBold,
            }}
          >
            Recent
          </Text>
          <ScrollView style={{ width: '100%' }}>
            {state.recentSearches.map((item, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return <SearchItemRouter key={item.id + index} item={item} />;
            })}
          </ScrollView>
        </>
      ) : null}
    </>
  );
}
