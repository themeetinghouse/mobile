import moment from 'moment';
import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { listLivestreams } from './queries';
import { ListLivestreamsQuery, Livestream } from './API';

export default class LiveEventService {
  static fetchLiveEventData = async (): Promise<Livestream[]> => {
    const today = moment().format('YYYY-MM-DD');
    try {
      const liveStreamsResult = (await API.graphql({
        query: listLivestreams,
        variables: { filter: { date: { eq: today } } },
      })) as GraphQLResult<ListLivestreamsQuery>;
      const sortBystartTime = (a: any, b: any) =>
        a?.startTime > b?.startTime ? 1 : -1;
      const filteredLiveEvents =
        liveStreamsResult?.data?.listLivestreams?.items.sort(
          sortBystartTime
        ) as Livestream[];
      return filteredLiveEvents;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}
