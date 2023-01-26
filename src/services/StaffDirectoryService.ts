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
import LocationsService from './LocationsService';
import { listSpeakersQuery } from './queries';

export type loadSpeakersListData = {
  items: NonNullable<ListSpeakersQuery['listSpeakers']>['items'];
  nextToken: NonNullable<ListSpeakersQuery['listSpeakers']>['nextToken'];
};

export default class StaffDirectoryService {
  static loadSpeakersList = async (
    limit = 9999,
    nextToken: string | undefined | null = null
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
      const locations = await LocationsService.loadLocations();
      const location = locations.find((location) => location.id === locationID);

      const filteredByLocation = [...staff, ...coordinators].filter(
        (person) =>
          location?.abbreviation &&
          person.sites?.includes(location?.abbreviation)
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
