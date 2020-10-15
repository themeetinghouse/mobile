//import axios from 'axios';
import { runGraphQLQuery } from './ApiService';
import LocationService, { Location } from './LocationsService';
import { GetFbEventsQuery } from './API'

export type EventQueryResult = NonNullable<GetFbEventsQuery['getFBEvents']>['data']

export default class EventsService {

  static loadEventsList = async (location: Location | null): Promise<EventQueryResult> => {
    const locations = await LocationService.loadLocations();
    const currentLocation = locations.filter((loc) => {
      return loc.id === location?.id;
    })
    let x: any;
    await fetch(`https://www.themeetinghouse.com/static/content/${currentLocation.length !== 0 ? currentLocation[0]?.id : "oakville"}.json`)
      .then((response) => response.json())
      .then((data) => {
        const item: any = data?.page?.content.filter((entry: any) => {
          return entry.class === 'events'
        })
        x = item[0]?.facebookEvents;
        return x;
      })
    if (x !== null) {
      const query = {
        query: getFbEvents,
        variables: { pageId: x[0] },
      }
      const queryResult = await runGraphQLQuery(query); // if no events then fetch with 155800937784104
      return queryResult.getFBEvents.data;
    }
    return [];
  }
}


const getFbEvents = `
  query GetFbEvents($pageId: String) {
    getFBEvents(pageId: $pageId) {
      data {
        description
        end_time
        name
        place {
          name
          location {
            city
            country
            latitude
            longitude
            state
            street
            zip
          }
          id
        }
        start_time
        id
        event_times {
          start_time
          end_time
          id
          ticket_uri
        }
      }
      paging {
        cursors {
          before
          after
        }
      }
    }
  }
  `;