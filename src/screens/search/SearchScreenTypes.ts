import { Comment, Notes, Series, Video } from '../../services/API';

export enum SearchScreenActionType {
  UPDATE_STATE = 'UPDATE_STATE',
  SET_SEARCH_CATEGORY = 'SET_SEARCH_CATEGORY',
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS',
  SET_RECENT_SEARCHES = 'SET_RECENT_SEARCHES',
  SET_INITIAL_RECENT_SEARCHES = 'SET_INITIAL_RECENT_SEARCHES',
  UPDATE_COMMENT_SEARCH_RESULTS = 'UPDATE_COMMENT_SEARCH_RESULTS',
}
export type SeriesResult = Series & { searchResultType: 'series' };
export type NotesResult = Notes & { searchResultType: 'notes' };
export type CommentResult = Comment & { searchResultType: 'comments' };
export type SermonsResult = Video & { searchResultType: 'sermons' };
export type SearchResult =
  | SeriesResult
  | NotesResult
  | CommentResult
  | SermonsResult;

export type SearchScreenState = {
  showRecent: boolean;
  recentSearches: Array<SearchResult>;
  searchText: string;
  searchCategory: string;
  isLoading: boolean;
  searchResults: Array<SearchResult>;
};

export type SearchScreenAction = {
  type: SearchScreenActionType;
  payload?: any;
};
