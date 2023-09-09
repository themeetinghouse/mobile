import { useContext, useEffect, useState } from 'react';
import { FBEvent } from '../services/API';
import LocationContext from '../../src/contexts/LocationContext';
import EventsService from '../../src/services/EventsService';

export default function useEvents(reload: boolean) {
  const [events, setEvents] = useState<FBEvent[]>([]);
  const location = useContext(LocationContext);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoaded(false);
        const eventsResult = await EventsService.loadEventsList(
          location?.locationData
        );
        setEvents(eventsResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    if (
      location?.locationData?.id !== 'unknown' ||
      location?.locationData?.name !== 'unknown'
    )
      loadEvents();
    else {
      setIsLoaded(true);
    }
  }, [
    location?.locationData,
    location?.locationData?.id,
    location?.locationData?.name,
    reload,
  ]);
  return { events, eventsLoaded: isLoaded };
}
