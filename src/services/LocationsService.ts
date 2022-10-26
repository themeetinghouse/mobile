import { LocationData } from '../contexts/LocationContext';

export interface Location {
  id: string;
  name: string;
  pastorEmail: string;
  location: {
    longitude: number;
    latitude: number;
    address: string;
  };
  facebookEvents: string[];
  serviceTimes: string[];
}

export const locations: { [key: string]: string } = {
  alliston: 'Alliston',
  sandbanks: 'Sandbanks',
  ancaster: 'Ancaster',
  brampton: 'Brampton',
  brantford: 'Brantford',
  burlington: 'Burlington',
  'hamilton-downtown': 'Hamilton - Downtown',
  'toronto-downtown': 'Toronto - Downtown',
  'hamilton-mountain': 'Hamilton Mountain',
  'toronto-east': 'Toronto - East',
  'toronto-high-park': 'Toronto - High Park',
  kitchener: 'Kitchener',
  london: 'London',
  newmarket: 'Newmarket',
  oakville: 'Oakville (Teaching Location)',
  ottawa: 'Ottawa',
  'owen-sound': 'Owen Sound',
  'parry-sound': 'Parry Sound',
  'richmond-hill': 'Richmond Hill',
  'toronto-uptown': 'Toronto - Uptown',
  waterloo: 'Waterloo',
  unknown: 'unknown',
};

export default class LocationsService {
  static async getLocationById(
    locationId: string
  ): Promise<Location | undefined> {
    const allLocations = await LocationsService.loadLocations();
    return allLocations?.find((location) => location.id === locationId);
  }

  static mapLocationIdToName(id: string): string {
    return locations[id];
  }

  static loadLocationDataForContext(): LocationData[] {
    return [
      {
        locationId: 'alliston',
        locationName: 'Alliston',
      },
      {
        locationId: 'sandbanks',
        locationName: 'Sandbanks',
      },
      {
        locationId: 'ancaster',
        locationName: 'Ancaster',
      },
      {
        locationId: 'brampton',
        locationName: 'Brampton',
      },
      {
        locationId: 'brantford',
        locationName: 'Brantford',
      },
      {
        locationId: 'burlington',
        locationName: 'Burlington',
      },
      {
        locationId: 'hamilton-downtown',
        locationName: 'Hamilton - Downtown',
      },
      {
        locationId: 'toronto-downtown',
        locationName: 'Toronto - Downtown',
      },
      {
        locationId: 'hamilton-mountain',
        locationName: 'Hamilton Mountain',
      },
      {
        locationId: 'toronto-east',
        locationName: 'Toronto - East',
      },
      {
        locationId: 'toronto-high-park',
        locationName: 'Toronto - High Park',
      },
      {
        locationId: 'kitchener',
        locationName: 'Kitchener',
      },
      {
        locationId: 'london',
        locationName: 'London',
      },
      {
        locationId: 'newmarket',
        locationName: 'Newmarket',
      },
      {
        locationId: 'oakville',
        locationName: 'Oakville',
      },
      {
        locationId: 'ottawa',
        locationName: 'Ottawa',
      },

      {
        locationId: 'owen-sound',
        locationName: 'Owen Sound',
      },
      {
        locationId: 'parry-sound',
        locationName: 'Parry Sound',
      },
      {
        locationId: 'richmond-hill',
        locationName: 'Richmond Hill',
      },
      {
        locationId: 'toronto-uptown',
        locationName: 'Toronto - Uptown',
      },
      {
        locationId: 'waterloo',
        locationName: 'Waterloo',
      },
    ];
  }

  static async loadLocations(): Promise<Location[] | undefined> {
    try {
      const res = await fetch(
        'https://www.themeetinghouse.com/static/data/locations.json'
      );
      const locationData = await res.json();
      return locationData;
    } catch {
      return undefined;
    }
  }
}
