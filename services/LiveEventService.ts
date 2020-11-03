import moment from "moment";
import * as SecureStore from 'expo-secure-store';
import { runGraphQLQuery } from "../services/ApiService"

export default class LiveEventService {
  static startLiveEventService = async (): Promise<any> => {
    try {
      const currentEventData = await LiveEventService.getLiveEventData()
      if (currentEventData) {
        console.log("Event data is set.")
        const needToUpdate = await LiveEventService.shouldUpdate(currentEventData)
        console.log("checking if needs to update. " + needToUpdate)
        if (needToUpdate) {
          await LiveEventService.fetchLiveEventData()
          return await LiveEventService.getLiveEventData()
        }
        else {
          return await LiveEventService.getLiveEventData()
        }
      }
      else {
        await LiveEventService.fetchLiveEventData()
        return await LiveEventService.getLiveEventData()
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  static fetchLiveEventData = async (): Promise<any> => {
    console.log("Fetching event data.")
    const today = moment().format('2020-11-01')
    try {
      const liveStreamsResult = await runGraphQLQuery({ query: listLivestreams, variables: { filter: { date: { eq: today } } } })
      if (liveStreamsResult) {
        await LiveEventService.setLiveEventData(liveStreamsResult.listLivestreams.items)
      }
      else {
        console.log("No live events for today.")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  static setLiveEventData = async (liveEvents: any): Promise<any> => {
    console.log("setting live event")
    console.log(liveEvents)
    try {
      await SecureStore.setItemAsync('liveEventData', JSON.stringify({ liveEvents, dateFetched: moment().format('2020-11-01') }))
    }
    catch (error) {
      console.log(error)
    }
  }

  static getLiveEventData = async (): Promise<any> => {
    const eventDataInStorage = await SecureStore.getItemAsync('liveEventData')
    return LiveEventService.parseStorageItem(eventDataInStorage)
  }

  static parseStorageItem = (liveEventsData: any): any => {
    const obj = JSON.parse(liveEventsData)
    return { ...obj, dateFetched: obj.dateFetched }
  }
  /*
  static setDateBack = async (): Promise<any> => {
    await SecureStore.setItemAsync('liveEventData', JSON.stringify({ dateFetched: moment().format('2020-10-29') }))
    console.log("setting date back")
  }*/

  static shouldUpdate = async (liveEventsData: any): Promise<boolean> => {
    try {
      console.log("Last fetched date " + liveEventsData.dateFetched)
      console.log("Current date " + moment().format('2020-11-01'))
      if (liveEventsData.dateFetched === undefined || liveEventsData.dateFetched < moment().format('2020-11-01')) {
        console.log("Data fetched is older than today!")
        return true;
      }
      else {
        console.log("Date fetched is not older. No need to update")
        return false
      }
    } catch (error) {
      return error;
    }
  }

}

const listLivestreams = /* GraphQL */ `
  query ListLivestreams(
    $filter: ModelLivestreamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestreams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        startTime
        videoStartTime
        endTime
        prerollYoutubeId
        liveYoutubeId
      }
      nextToken
    }
  }
`;