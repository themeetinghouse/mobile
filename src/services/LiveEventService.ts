import moment from 'moment';
import * as SecureStore from 'expo-secure-store';
import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { listLivestreams } from './queries';
import { ListLivestreamsQuery, Livestream } from './API';

type StoredLiveEvents = {
  dateFetched: string;
  liveEvents: Livestream[];
};

export default class LiveEventService {
  static startLiveEventService = async (): Promise<StoredLiveEvents | null> => {
    try {
      const currentEventData = await LiveEventService.getLiveEventData();
      if (currentEventData) {
        console.log('Event data is set.');
        const needToUpdate = await LiveEventService.shouldUpdate(
          currentEventData
        );
        if (needToUpdate) {
          await LiveEventService.fetchLiveEventData();
          return await LiveEventService.getLiveEventData();
        }
        return await LiveEventService.getLiveEventData();
      }
      await LiveEventService.fetchLiveEventData();
      return await LiveEventService.getLiveEventData();
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static fetchLiveEventData = async (): Promise<void> => {
    const today = moment().format('YYYY-MM-DD');
    try {
      const { data } = (await API.graphql({
        query: listLivestreams,
        variables: { filter: { date: { eq: today } } },
      })) as GraphQLResult<ListLivestreamsQuery>;
      const allEvents = data?.listLivestreams?.items ?? [];
      const onlyLiveEvents = allEvents.filter(
        (liveEvent) =>
          liveEvent?.liveYoutubeId || !liveEvent?.id.includes('CustomEvent')
      ) as Livestream[];
      await LiveEventService.storeLiveEventData(onlyLiveEvents);
    } catch (error) {
      console.log(error);
    }
  };

  static storeLiveEventData = async (
    liveEvents: Livestream[]
  ): Promise<void> => {
    try {
      await SecureStore.setItemAsync(
        'liveEventData',
        JSON.stringify({
          liveEvents,
          dateFetched: moment().format('YYYY-MM-DD'),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  static getLiveEventData = async (): Promise<StoredLiveEvents> => {
    const eventDataInStorage =
      (await SecureStore.getItemAsync('liveEventData')) ?? '';
    return LiveEventService.parseStorageItem(eventDataInStorage);
  };

  static parseStorageItem = (liveEventsData: string): StoredLiveEvents => {
    const obj = JSON.parse(liveEventsData);
    return { ...obj, dateFetched: obj?.dateFetched };
  };

  static shouldUpdate = async (
    liveEventsData: StoredLiveEvents
  ): Promise<boolean> => {
    try {
      // console.log("Last fetched date " + liveEventsData.dateFetched)
      // console.log("Current date " + moment().format('YYYY-MM-DD'))
      if (
        liveEventsData.dateFetched === undefined ||
        liveEventsData.dateFetched < moment().format('YYYY-MM-DD')
      ) {
        // console.log("Data fetched is older than today!")
        return true;
      }
      // console.log("Date fetched is not older. No need to update")
      return false;
    } catch (error) {
      return false;
    }
  };
}
