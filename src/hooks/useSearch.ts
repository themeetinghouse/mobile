import { useEffect } from 'react';
import usePrevious from './usePrevious';
import { useDebounce2 } from './useDebounce2';
import { useSearchContext } from '../screens/search/SearchContext';
import { SearchScreenActionType } from '../screens/search/SearchScreenTypes';
import SeriesService from '../services/SeriesService';
import NotesService from '../services/NotesService';
import CommentService from '../services/CommentService';
import SermonsService from '../services/SermonsService';

export default function useSearch() {
  const { state, dispatch } = useSearchContext();
  const debouncedSearchText = useDebounce2(state.searchText, 1200);
  const previousValue = usePrevious(debouncedSearchText);
  const shouldSearch =
    debouncedSearchText !== previousValue && debouncedSearchText.length > 0;
  useEffect(() => {
    const search = async () => {
      try {
        console.log('================== GETTING SERIES ====================');
        const seriesResponse =
          SeriesService.searchForSeries(debouncedSearchText);

        console.log('================== GETTING SERIES ====================');
        const notesResponse = NotesService.searchForNotes(debouncedSearchText);

        console.log('================== GETTING COMMENTS ====================');
        const commentsResponse =
          CommentService.searchForComments(debouncedSearchText);

        console.log('================== GETTING SERMONS ====================');
        const sermonsResponse =
          SermonsService.searchForSermons(debouncedSearchText);

        const allRequests = await Promise.all([
          sermonsResponse,
          seriesResponse,
          notesResponse,
          commentsResponse,
        ]);
        const [sermonsData, seriesData, notesData, commentsData] = allRequests;
        console.log({ sermonsData });
        console.log({ seriesData });
        console.log({ notesData });
        console.log({ commentsData });

        const allData = [
          ...sermonsData.map((sermon) => ({
            ...sermon,
            searchResultType: 'sermons',
          })),
          ...seriesData.map((series) => ({
            ...series,
            searchResultType: 'series',
          })),
          ...notesData.map((note) => ({ ...note, searchResultType: 'notes' })),
          ...commentsData.map((comment) => ({
            ...comment,
            searchResultType: 'comments',
          })),
        ];
        dispatch({
          type: SearchScreenActionType.SET_SEARCH_RESULTS,
          payload: allData,
        });
      } catch (error) {
        console.error({ error });
      } finally {
        dispatch({
          type: SearchScreenActionType.UPDATE_STATE,
          payload: { isLoading: false },
        });
      }
    };
    if (shouldSearch) search();
    else {
      dispatch({
        type: SearchScreenActionType.UPDATE_STATE,
        payload: { isLoading: false },
      });
    }
  }, [debouncedSearchText, dispatch, previousValue, shouldSearch]);
}
