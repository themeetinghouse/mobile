import moment from 'moment';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import LocationService, { Location } from './LocationsService';
import { ListAnnouncementsQuery } from './API';
import { listAnnouncements } from './queries';

export type Announcement = NonNullable<
  NonNullable<ListAnnouncementsQuery['listAnnouncements']>['items']
>[0];

export default class AnnouncementService {
  static loadAnnouncements = async (
    location: Location | null
  ): Promise<Announcement[]> => {
    const locations = await LocationService.loadLocations();
    let currentLocation;
    if (location?.id === 'unknown') {
      currentLocation = 'Cross-Regional';
    } else {
      currentLocation = locations?.filter((loc: Location) => {
        return loc.id === location?.id;
      })?.[0]?.name;
    }

    const today = moment()
      .utcOffset(moment().isDST() ? '-0400' : '-0500')
      .format('YYYY-MM-DD');
    const variables = {
      filter: {
        publishedDate: { le: today },
        expirationDate: { gt: today },
        or: [
          { parish: { eq: currentLocation ?? 'Cross-Regional' } },
          { parish: { eq: 'Cross-Regional' } },
        ],
      },
    };
    const json = (await API.graphql(
      graphqlOperation(listAnnouncements, variables)
    )) as GraphQLResult<ListAnnouncementsQuery>;
    let announcements = json?.data?.listAnnouncements?.items;
    if (announcements) {
      announcements = announcements.sort((a, b) =>
        b && a ? b.publishedDate.localeCompare(a.publishedDate) : 0
      );
    }
    return announcements ?? [];
  };
}
