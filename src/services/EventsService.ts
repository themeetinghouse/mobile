import { runGraphQLQuery } from './ApiService';
import LocationService, { Location } from './LocationsService';
import { GetFBEventsQuery } from './API';
import { getFbEvents } from './queries';

export type EventQueryResult = NonNullable<
  GetFBEventsQuery['getFBEvents']
>['data'];

function parseFBDate(date: string): Date {
  const st = `${date.substring(0, date.length - 2)}:${date.substring(
    date.length - 2
  )}`;
  return new Date(st);
}
export default class EventsService {
  static filterEvents = (events: any) => {
    return events.filter((item: any) => {
      if (!item?.start_time) {
        return false;
      }
      return new Date() < parseFBDate(item.start_time);
    });
  };

  static loadEventsList = async (
    location: Location | null
  ): Promise<EventQueryResult> => {
    const locations = await LocationService.loadLocations();
    const currentLocation = locations?.filter((loc) => {
      return loc.id === location?.id;
    });
    const getSiteData: any = await fetch(
      `https://www.themeetinghouse.com/static/content/${
        currentLocation && currentLocation?.length > 0
          ? currentLocation[0]?.id
          : 'oakville'
      }.json`
    );
    const pageContent = await getSiteData.json();
    const selectedLocation: any = await pageContent?.page?.content.filter(
      (entry: any) => {
        return entry.class === 'events';
      }
    );
    const queryResult = await runGraphQLQuery({
      query: getFbEvents,
      variables: { pageId: selectedLocation[0].facebookEvents[0] },
    });
    return this.filterEvents(queryResult.getFBEvents.data.reverse());
  };
}
