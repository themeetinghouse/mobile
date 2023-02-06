import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SearchScreenAction,
  SearchScreenActionType,
  SearchScreenState,
} from './SearchScreenTypes';

export default function contentScreenReducer(
  state: SearchScreenState,
  action: SearchScreenAction
): SearchScreenState {
  switch (action.type) {
    case SearchScreenActionType.SET_SEARCH_TEXT: {
      const noSearchTerm = action.payload.length === 0;
      return {
        ...state,
        isLoading: !noSearchTerm,
        searchResults: noSearchTerm ? [] : state.searchResults,
        searchCategory:
          action.payload.length === 0 ? 'Everything' : state.searchCategory,
        searchText: action.payload,
        showRecent: noSearchTerm,
      };
    }
    case SearchScreenActionType.SET_SEARCH_CATEGORY:
      return {
        ...state,
        searchCategory: action.payload,
      };
    case SearchScreenActionType.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case SearchScreenActionType.SET_INITIAL_RECENT_SEARCHES:
      return {
        ...state,
        recentSearches: action.payload,
      };
    case SearchScreenActionType.SET_RECENT_SEARCHES: {
      const newRecentSearches = [...state.recentSearches];
      const recentSearchesSet = new Set(
        state.recentSearches.map((item) => item.id)
      );

      if (!recentSearchesSet.has(action.payload.id)) {
        if (newRecentSearches.length === 10) {
          newRecentSearches.pop();
        }
        newRecentSearches.unshift(action.payload);
      } else {
        const indexToReplace = state.recentSearches.findIndex(
          (item) => item.id === action.payload.id
        );
        newRecentSearches.splice(indexToReplace, 1, action.payload);
      }
      const today = new Date().toISOString().split('T')[0];
      AsyncStorage.setItem('lastSearchUpdate', today);
      AsyncStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      return {
        ...state,
        recentSearches: newRecentSearches,
      };
    }
    case SearchScreenActionType.UPDATE_COMMENT_SEARCH_RESULTS: {
      const searchResults = [...state.searchResults];
      const searchResultsSet = new Set(
        state.searchResults.map((item) => item.id)
      );
      if (searchResultsSet.has(action.payload.id)) {
        const indexToReplace = state.searchResults.findIndex(
          (item) => item.id === action.payload.id
        );
        searchResults.splice(indexToReplace, 1, action.payload);
      }

      return {
        ...state,
        searchResults,
      };
    }
    case SearchScreenActionType.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
