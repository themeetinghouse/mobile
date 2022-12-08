export interface Location {
  id: string;
  name: string;
  pastorEmail?: string;
  regionShortName?: string;
  homeChurchGroupID?: string;
  abbreviation?: string;
  serviceTimeDescription?: string;
  region?: string;
  location?: {
    longitude?: number;
    latitude?: number;
    address?: string;
  };
  facebookEvents?: string[];
  serviceTimes?: string[];
}

export default class LocationsService {
  static async getLocationById(
    locationId: string
  ): Promise<Location | undefined> {
    const allLocations = await LocationsService.loadLocations();
    return allLocations?.find((location) => location.id === locationId);
  }

  static async loadLocations(): Promise<Location[]> {
    try {
      const res = await fetch(
        'https://www.themeetinghouse.com/static/data/locations.json'
      );
      const locationData: Location[] = await res.json();
      return locationData.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      return [];
    }
  }
}
