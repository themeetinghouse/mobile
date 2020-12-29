//import axios from 'axios';
import { runGraphQLQuery } from './ApiService';
import moment from "moment";
import LocationService, { Location } from './LocationsService';
export type Announcement = {
  id?: string;
  title: string;
  description: string;
  publishedDate: string;
  expirationDate: string;
  image?: string;
  parish?: string;
  crossRegional?: string;
  callToAction?: string;
};

export default class AnnouncementService {

  static loadAnnouncements = async (location: Location | null): Promise<Announcement[]> => {
    const locations = await LocationService.loadLocations();
    let currentLocation;
    if (location?.id === "unknown") {
      currentLocation = "Cross-Regional"
    }
    else {
      currentLocation = locations?.filter((loc: any) => {
        return loc.id === location?.id;
      })?.[0]?.name
    }

    const today = moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('YYYY-MM-DD')
    const queryResult = await runGraphQLQuery({
      query: listAnnouncements,
      variables: {
        filter: {
          expirationDate: { gt: today },
          or: [
            { parish: { eq: currentLocation ?? "Cross-Regional" } },
            { parish: { eq: "Cross-Regional" } }
          ]
        }
      },
    })
    const announcements = await queryResult?.listAnnouncements?.items;
    return announcements
  }

}

export const listAnnouncements = /* GraphQL */ `
  query ListAnnouncements(
    $filter: ModelAnnouncementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        publishedDate
        expirationDate
        image
        parish
        crossRegional
        title
        description
        callToAction
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listAnnouncementsByParishByDate = /* GraphQL */ `
  query ListAnnouncementsByParishByDate(
    $crossRegional: String
    $parishExpirationDatePublishedDate: ModelAnnouncementByParishByDateCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAnnouncementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnnouncementsByParishByDate(
      crossRegional: $crossRegional
      parishExpirationDatePublishedDate: $parishExpirationDatePublishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        publishedDate
        expirationDate
        image
        parish
        crossRegional
        title
        description
        callToAction
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;