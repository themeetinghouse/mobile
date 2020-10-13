//import axios from 'axios';
import { runGraphQLQuery } from './ApiService';
import LocationService, { Location } from './LocationsService';
import { GetFbEventsQuery } from './API'

export type EventQueryResult = NonNullable<GetFbEventsQuery['getFBEvents']>['data']

export default class EventsService {

  static loadEventsList = async (location: Location | null): Promise<EventQueryResult> => {
    console.log(`logging location ${JSON.stringify(location)}`)

    const locations = await LocationService.loadLocations();
    const currentLocation = locations.filter((loc) => {
      return loc.id === location?.locationId;
    })
    console.log(currentLocation.length)
    let x: any;
    await fetch(`https://www.themeetinghouse.com/static/content/${currentLocation.length !== 0 ? currentLocation[0]?.id : "oakville"}.json`) //put this in a variable and await its result to return
      .then((response) => response.json())
      .then((data) => {
        const item: any = data?.page?.content.filter((item: any) => {
          return item.class === 'events'
        })
        x = item[0]?.facebookEvents;
        return x;
      })
    if (x !== null) {
      const query = {
        query: getFbEvents,
        variables: { pageId: x[0] },
      }
      const queryResult = await runGraphQLQuery(query);
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