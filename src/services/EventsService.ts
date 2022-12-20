import API, { GraphQLResult } from '@aws-amplify/api';
import LocationService, { Location } from './LocationsService';
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
    location: Location | undefined | null
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
      const defaultLocation = locations?.filter((loc) => {
        return loc.id === 'oakville';
      });
      const idsToFetch: string[] = defaultLocation?.[0]?.facebookEvents ?? [];
      const events = await getEvents(idsToFetch);
      return events as FBEvent[];
    }
    const events = await getEvents(location?.facebookEvents ?? []);
    console.log({ events });
    return events as FBEvent[];
  };
}
