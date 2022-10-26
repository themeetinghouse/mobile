import { GraphQLResult } from '@aws-amplify/api';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';
import { API } from 'aws-amplify';
import {
  tMHPersonByIsCoordinator,
  tMHPersonByIsStaff,
} from '../../src/graphql/queries';
import {
  TMHPerson,
  TMHPersonByIsCoordinatorQuery,
  TMHPersonByIsStaffQuery,
  TMHPersonByIsTeacherQuery,
} from './API';
import { ListSpeakersQuery } from './API';
import { listSpeakersQuery } from './queries';

export type loadSpeakersListData = {
  items: NonNullable<ListSpeakersQuery['listSpeakers']>['items'];
  nextToken: NonNullable<ListSpeakersQuery['listSpeakers']>['nextToken'];
};

type MapToLocation = {
  title: string;
  code: string;
  locationID: string;
};

export default class StaffDirectoryService {
  static loadSpeakersList = async (
    limit = 9999,
    nextToken = null
  ): Promise<loadSpeakersListData> => {
    const speakersResult = (await API.graphql({
      query: listSpeakersQuery,
      variables: { limit, nextToken },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    })) as GraphQLResult<ListSpeakersQuery>;

    //const staff = await StaffDirectoryService.loadStaffList();
    const speakersNext = speakersResult.data?.listSpeakers?.nextToken ?? '';
    const speakersItems = speakersResult?.data?.listSpeakers?.items ?? [];
    // speakersItems.map((speaker, index: number) => {
    //   for (let x = 0; x < staff.length; x++) {
    //     if (`${staff[x].firstName} ${staff[x].lastName}` === speaker?.name) {
    //       //if (!speaker.hidden) console.log(speaker.name);
    //     }
    //   }
    // });
    return {
      items: speakersItems.filter((a) => a?.videos?.items.length !== 0),
      nextToken: speakersNext,
    };
  };
  static mapToLocation(code: string): MapToLocation {
    switch (code) {
      case 'HMAN':
        return { title: 'Ancaster', code: 'HMAN', locationID: 'ancaster' };
      case 'ALLI':
        return { title: 'Alliston', code: 'HMAN', locationID: 'alliston' };
      case 'BRAM':
        return { title: 'Brampton', code: 'BRAM', locationID: 'brampton' };
      case 'BRFD':
        return { title: 'Brantford', code: 'BRFD', locationID: 'brantford' };
      case 'BURL':
        return { title: 'Burlington', code: 'BURL', locationID: 'burlington' };
      case 'HMMT':
        return {
          title: 'Hamilton Mountain',
          code: 'HMMT',
          locationID: 'hamilton-mountain',
        };
      case 'HMDT':
        return {
          title: 'Hamilton - Downtown',
          code: 'HMDT',
          locationID: 'hamilton-downtown',
        };
      case 'KIT':
        return { title: 'Kitchener', code: 'KIT', locationID: 'kitchener' };
      case 'LOND':
        return { title: 'London', code: 'LOND', locationID: 'london' };
      case 'NMKT':
        return { title: 'Newmarket', code: 'NMKT', locationID: 'newmarket' };
      case 'OAKV':
        return { title: 'Oakville', code: 'OAKV', locationID: 'oakville' };
      case 'OTTA':
        return { title: 'Ottawa', code: 'OTTA', locationID: 'ottawa' };
      case 'OWSN':
        return { title: 'Owen Sound', code: 'OWSN', locationID: 'owen-sound' };
      case 'PRSN':
        return {
          title: 'Parry Sound',
          code: 'PRSN',
          locationID: 'parry-sound',
        };
      case 'RHLL':
        return {
          title: 'Richmond Hill',
          code: 'RHLL',
          locationID: 'richmond-hill',
        };
      case 'SAND':
        return { title: 'Sandbanks', code: 'SAND', locationID: 'Sandbanks' };
      case 'TODT':
        return {
          title: 'Toronto - Downtown',
          code: 'TODT',
          locationID: 'toronto-downtown',
        };
      case 'TOBC':
        return {
          title: 'Toronto - East',
          code: 'TOBC',
          locationID: 'toronto-east',
        };
      case 'TOHP':
        return {
          title: 'Toronto - High Park',
          code: 'TOHP',
          locationID: 'toronto-high-park',
        };
      case 'TOUP':
        return {
          title: 'Toronto - Uptown',
          code: 'TOUP',
          locationID: 'toronto-uptown',
        };
      case 'WAT':
        return { title: 'Waterloo', code: 'WAT', locationID: 'waterloo' };
      default:
        return { title: 'unknown', code: '', locationID: 'unknown' };
    }
  }
  static loadStaffTeachersList = async (): Promise<TMHPerson[]> => {
    const staffData = (await API.graphql({
      query: tMHPersonByIsStaff,
      variables: { isTeacher: 'true', limit: 200 },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    })) as GraphQLResult<TMHPersonByIsTeacherQuery>;
    return staffData?.data?.TMHPersonByIsTeacher?.items as TMHPerson[];
  };
  static loadStaffListByLocation = async (
    locationID: string
  ): Promise<TMHPerson[]> => {
    try {
      const staff = await StaffDirectoryService.loadStaffList();
      const coordinators = await StaffDirectoryService.loadCoordinatorsList();
      const filteredByLocation = [...staff, ...coordinators].filter(
        (person) => {
          const personSite =
            person.sites?.find((site) => {
              return this.mapToLocation(site ?? '').locationID !== 'unknown';
            }) ?? '';
          return this.mapToLocation(personSite).locationID === locationID;
        }
      );
      return filteredByLocation;
    } catch (error) {
      return [];
    }
  };
  static loadStaffList = async (): Promise<TMHPerson[]> => {
    try {
      const staffData = (await API.graphql({
        query: tMHPersonByIsStaff,
        variables: { isStaff: 'true', limit: 200 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      })) as GraphQLResult<TMHPersonByIsStaffQuery>;
      const staff =
        (staffData?.data?.TMHPersonByIsStaff?.items as TMHPerson[]) ?? [];
      return staff.sort((personA, personB) =>
        (personA?.lastName ?? '').localeCompare(personB?.lastName ?? '')
      );
    } catch (error) {
      console.error('There was an error loading staff.');
      console.log({ error });
      return [];
    }
  };

  static loadCoordinatorsList = async (): Promise<TMHPerson[]> => {
    try {
      const coordinatorData = (await API.graphql({
        query: tMHPersonByIsCoordinator,
        variables: { isCoordinator: 'true', limit: 200 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      })) as GraphQLResult<TMHPersonByIsCoordinatorQuery>;
      const coordinators =
        (coordinatorData?.data?.TMHPersonByIsCoordinator
          ?.items as TMHPerson[]) ?? [];
      return coordinators.sort((personA, personB) =>
        (personA?.lastName ?? '').localeCompare(personB?.lastName ?? '')
      );
    } catch (error) {
      console.error('There was an error loading coordinators.');
      console.log({ error });
      return [];
    }
  };
}
