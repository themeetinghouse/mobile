import { createContext } from 'react';

export type LocationData =
  | { locationId: string; locationName: string }
  | null
  | undefined;

type LocationContext = {
  locationData: LocationData;
  setLocationData: (data: LocationData) => void;
} | null;

const LocationContext = createContext<LocationContext>({
  locationData: null,
  setLocationData: () => null,
});
export default LocationContext;
