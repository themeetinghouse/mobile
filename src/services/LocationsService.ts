import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { listTMHLocations } from './queries';
import { ListTMHLocationsQuery, TMHLocation } from './API';

export default class LocationsService {
  static async getLocationById(
    locationId: string
  ): Promise<TMHLocation | undefined> {
    const allLocations = await LocationsService.loadLocations();
    return allLocations?.find((location) => location.id === locationId);
  }

  static async loadLocations(): Promise<TMHLocation[]> {
    try {
      const response = (await API.graphql({
        query: listTMHLocations,
      })) as GraphQLResult<ListTMHLocationsQuery>;
      const items = response.data?.listTMHLocations?.items ?? [];
      console.log({ response });

      return items.sort((a, b) => {
        if (a?.name && b?.name) return a.name.localeCompare(b.name);
        return 0;
      }) as TMHLocation[];
    } catch {
      return [];
    }
  }
}
