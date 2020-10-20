//import axios from 'axios';
import { runGraphQLQuery } from './ApiService';
import LocationService, { Location } from './LocationsService';
import { GetFbEventsQuery } from './API'

export type EventQueryResult = NonNullable<GetFbEventsQuery['getFBEvents']>['data']

export default class EventsService {
  // static getDefaultEventsList = async (): Promise<EventQueryResult> => {
  //   let x: any;
  //   await fetch(`https://www.themeetinghouse.com/static/content/oakville.json`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const item: any = data?.page?.content.filter((entry: any) => {
  //         return entry.class === 'events'
  //       })
  //       x = item[0]?.facebookEvents;
  //       return x;
  //     })
  //   const query = {
  //     query: getFbEvents,
  //     variables: { pageId: x[0] },
  //   }
  //   const queryResult = await runGraphQLQuery(query);
  //   return queryResult.getFBEvents.data;
  // }

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

    const query = {
      query: getFbEvents,
      variables: { pageId: x[0] },
    }
    const queryResult = await runGraphQLQuery(query);
    //console.log("length of data array is : " + queryResult.getFBEvents.data.length)
    /*if (queryResult.getFBEvents.data.length === 0) {
      const a: any = await runGraphQLQuery({ query: getFbEvents, variables: { pageId: "192337637474940" } })
      return a.getFBEvents.data;
    }*/
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