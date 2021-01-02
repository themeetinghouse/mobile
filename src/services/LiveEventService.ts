import moment from 'moment';
import * as SecureStore from 'expo-secure-store';
import { runGraphQLQuery } from './ApiService';
import { listLivestreams } from './queries';

export default class LiveEventService {
  static startLiveEventService = async (): Promise<any> => {
    try {
      const currentEventData = await LiveEventService.getLiveEventData();
      if (currentEventData) {
        // console.log("Event data is set.")
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
    }
  };

  static fetchLiveEventData = async (): Promise<any> => {
    // console.log("Fetching event data.")
    const today = moment().format('YYYY-MM-DD');
    try {
      const liveStreamsResult = await runGraphQLQuery({
        query: listLivestreams,
        variables: { filter: { date: { eq: today } } },
      });
      const filteredLiveEvents = liveStreamsResult?.listLivestreams?.items.filter(
        (a: any) => a.liveYoutubeId || !a.id.includes('CustomEvent')
      );
      await LiveEventService.storeLiveEventData(filteredLiveEvents);
    } catch (error) {
      console.log(error);
    }
  };

  static storeLiveEventData = async (liveEvents: any): Promise<any> => {
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

  static getLiveEventData = async (): Promise<any> => {
    const eventDataInStorage = await SecureStore.getItemAsync('liveEventData');
    return LiveEventService.parseStorageItem(eventDataInStorage);
  };

  static parseStorageItem = (liveEventsData: any): any => {
    const obj = JSON.parse(liveEventsData);
    return { ...obj, dateFetched: obj?.dateFetched };
  };

  static shouldUpdate = async (liveEventsData: any): Promise<boolean> => {
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
      return error;
    }
  };
}
