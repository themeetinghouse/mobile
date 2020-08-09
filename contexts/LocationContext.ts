import { createContext } from 'react';
import { Location } from '../services/LocationsService';

export type LocationData = Location | null | undefined

type LocationContext = {
    locationData: LocationData;
    setLocationData: (data: LocationData) => void;
} | null

const LocationContext = createContext<LocationContext>({ locationData: null, setLocationData: () => null });
export default LocationContext