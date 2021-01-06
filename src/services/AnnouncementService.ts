import moment from 'moment';
import { runGraphQLQuery } from './ApiService';
import LocationService, { Location } from './LocationsService';
import { listAnnouncements } from './queries';

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
    const queryResult = await runGraphQLQuery({
      query: listAnnouncements,
      variables: {
        filter: {
          publishedDate: { le: today },
          expirationDate: { gt: today },
          or: [
            { parish: { eq: currentLocation ?? 'Cross-Regional' } },
            { parish: { eq: 'Cross-Regional' } },
          ],
        },
      },
    });
    const announcements = await queryResult?.listAnnouncements?.items?.sort(
      (a: Announcement, b: Announcement) =>
        b.publishedDate.localeCompare(a.publishedDate)
    );
    return announcements;
  };
}
