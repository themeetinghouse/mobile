import { GraphQLResult } from '@aws-amplify/api';
import { API } from 'aws-amplify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  GetNotesQuery,
  GetVideoByVideoTypeQuery,
  GetVideoByVideoTypeQueryVariables,
  ModelSortDirection,
} from '../../src/services/API';
import NotesService from '../../src/services/NotesService';
import { getVideoByVideoType } from '../../src/services/queries';
import { VideoData } from '../../src/utils/types';

const getLastSunday = () => {
  const lastSunday = moment();
  if (lastSunday.isoWeekday() < 7) {
    lastSunday.isoWeekday(0);
  }
  return lastSunday.format('YYYY-MM-DD');
};
export default function useTeaching(reload: boolean) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teaching, setTeaching] = useState<VideoData>(null);
  const [note, setNote] = useState<GetNotesQuery['getNotes']>(null);
  useEffect(() => {
    let apiRequest: Promise<GraphQLResult<GetVideoByVideoTypeQuery>>;
    const loadTeaching = async () => {
      try {
        setIsLoaded(false);
        const variables: GetVideoByVideoTypeQueryVariables = {
          videoTypes: 'adult-sunday',
          limit: 1,
          sortDirection: ModelSortDirection.DESC,
        };
        apiRequest = API.graphql({
          query: getVideoByVideoType,
          variables,
        }) as Promise<GraphQLResult<GetVideoByVideoTypeQuery>>;
        const res = await apiRequest;
        if (res.data?.getVideoByVideoType?.items?.[0]) {
          const noteJson = await NotesService.loadNotesNoContent(
            getLastSunday()
          );
          setNote(noteJson);
          setTeaching(res.data.getVideoByVideoType.items[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTeaching();
    return () => {
      API.cancel(apiRequest);
    };
  }, [reload]);
  return { teaching, note, teachingLoaded: isLoaded };
}
