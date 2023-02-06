import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import searchScreenReducer from './SearchScreenReducer';
import { SearchScreenAction, SearchScreenState } from './SearchScreenTypes';

const initialState: SearchScreenState = {
  showRecent: true,
  searchText: '',
  searchCategory: 'Everything',
  recentSearches: [],
  searchResults: [],
  isLoading: false,
};

const SearchScreenContext = createContext<{
  state: SearchScreenState;
  dispatch: Dispatch<SearchScreenAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useSearchContext = () => {
  return useContext(SearchScreenContext);
};

export const SearchScreenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(searchScreenReducer, initialState);
  const memoizedValue = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );
  return (
    <SearchScreenContext.Provider value={memoizedValue}>
      {children}
    </SearchScreenContext.Provider>
  );
};
