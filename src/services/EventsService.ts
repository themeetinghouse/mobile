import { API, GraphQLResult } from '@aws-amplify/api';
import { LocationData } from '../contexts/LocationContext';
import LocationService from './LocationsService';
import { FBEvent, GetFBEventsQuery } from './API';
import { getFbEvents } from './queries';

function parseFBDate(date: string): Date {
  const st = `${date.substring(0, date.length - 2)}:${date.substring(
    date.length - 2
  )}`;
  return new Date(st);
}
export default class EventsService {
  static filterEvents = (events: FBEvent[]) => {
    return events.filter((item) => {
      if (!item?.start_time) {
        return false;
      }
      return new Date() < parseFBDate(item.start_time);
    });
  };

  static loadEventsList = async (
    location: LocationData
  ): Promise<Array<FBEvent>> => {
    const getEvents = async (ids: string[]) => {
      const eventPromises: Array<GraphQLResult<GetFBEventsQuery>> = [];
      ids.forEach((id: string) => {
        const requestForID = API.graphql({
          query: getFbEvents,
          variables: { pageId: id },
        }) as GraphQLResult<GetFBEventsQuery>;
        eventPromises.push(requestForID);
      });
      const results = await Promise.all(eventPromises);
      return results
        .map((result) => {
          return result.data?.getFBEvents?.data;
        })
        .flat();
    };
    if (!location?.id || location?.id === 'unknown') {
      // get oakville events
      const locations = await LocationService.loadLocations();
      const defaultLocation = locations?.find((loc) => {
        return loc.id === 'oakville';
      });
      const idsToFetch =
        (defaultLocation?.socials?.facebook
          ?.map((fb) => fb?.pageId)
          .filter((pageId) => pageId) as string[]) ?? [];
      const events = await getEvents(idsToFetch);
      return events as FBEvent[];
    }
    const idsToFetch =
      (location?.socials?.facebook
        ?.map((fb) => fb?.pageId)
        .filter((pageId) => pageId) as string[]) ?? [];
    const events = await getEvents(idsToFetch);
    return events.filter((event) => Boolean(event)) as FBEvent[];
  };
}
