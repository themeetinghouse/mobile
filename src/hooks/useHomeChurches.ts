/* eslint-disable eqeqeq */
// added this due to locations.json loading a cached version
// of the locations.json file. This is a temporary fix..
// it should self resolve.. check that homeChurchGroupID is a string
// and not a number and then we can do strict equality check
import { useEffect, useState } from 'react';
import { getDayOfWeek } from '../screens/homechurch/HomeChurchUtils';
import { LocationData } from '../contexts/LocationContext';
import HomeChurchService, {
  F1HomeChurchInfoWithLocation,
} from '../services/HomeChurchService';

export default function useHomeChurches(
  day: string,
  location: LocationData
): {
  homeChurches: F1HomeChurchInfoWithLocation[];
  homeChurchIsLoading: boolean;
  filteredHomeChurches: F1HomeChurchInfoWithLocation[];
  homeChurchesWithLocation: F1HomeChurchInfoWithLocation[];
} {
  const [homeChurches, setHomeChurches] = useState<
    F1HomeChurchInfoWithLocation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadHomeChurches = async () => {
      try {
        setIsLoading(true);
        const homeChurches =
          await HomeChurchService.loadDataForHomeChurchScreen();
        setHomeChurches(homeChurches);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
  }, []);
  const filteredHomeChurches = homeChurches.filter(
    (homeChurch) =>
      (location?.id === 'all' && getDayOfWeek(homeChurch) === day) ||
      (location?.id === 'all' && day === 'All Days') ||
      (location?.homeChurchGroupID == homeChurch?.groupType?.id &&
        getDayOfWeek(homeChurch) === day) ||
      (location?.homeChurchGroupID == homeChurch?.groupType?.id &&
        day === 'All Days')
  );
  const homeChurchesWithLocation = filteredHomeChurches.filter(
    (homeChurch) =>
      homeChurch.location?.address?.latitude &&
      homeChurch.location?.address?.longitude
  );
  return {
    homeChurches,
    filteredHomeChurches,
    homeChurchesWithLocation,
    homeChurchIsLoading: isLoading,
  };
}
