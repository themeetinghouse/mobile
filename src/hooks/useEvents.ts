import { useContext, useEffect, useState } from 'react';
import LocationContext from '../../src/contexts/LocationContext';
import EventsService, {
  EventQueryResult,
} from '../../src/services/EventsService';
import { Location } from '../../src/services/LocationsService';

export default function useEvents(reload: boolean) {
  const [events, setEvents] = useState<EventQueryResult>([]);
  const location = useContext(LocationContext);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoaded(false);
        const eventsResult = await EventsService.loadEventsList({
          id: location?.locationData?.id,
          name: location?.locationData?.name,
        } as Location);
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
  }, [location?.locationData?.id, location?.locationData?.name, reload]);
  return { events, eventsLoaded: isLoaded };
}
