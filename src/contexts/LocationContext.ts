import { createContext } from 'react';
import { TMHLocation } from 'src/services/API';

export type LocationData = TMHLocation | null | undefined;

type LocationContext = {
  locationData: LocationData;
  setLocationData: (data: LocationData) => void;
} | null;

const LocationContext = createContext<LocationContext>({
  locationData: null,
  setLocationData: () => null,
});

export default LocationContext;
