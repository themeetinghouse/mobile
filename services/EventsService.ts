//import axios from 'axios';
import { runGraphQLQuery } from './ApiService';
import { Location } from './LocationsService'; 
import { GetFbEventsQuery } from './API'

export type EventQueryResult = NonNullable<GetFbEventsQuery['getFBEvents']>['data']

export default class EventsService {

  static loadEventsList = async (location: Location | null | undefined): Promise<EventQueryResult> => {
    const query = { 
      query: getFbEvents,
      variables: { pageId: location?.facebookEvents[0] },
    }
    //console.log("EventsService.loadEventsList(): query = ", query);
    const queryResult = await runGraphQLQuery(query);
    //console.log("EventsService.loadEventsList(): queryResult.getFBEvents.data = ", queryResult.getFBEvents.data);
    return queryResult.getFBEvents.data;
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