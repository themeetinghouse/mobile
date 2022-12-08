import { useContext, useEffect, useState } from 'react';
import LocationContext from '../contexts/LocationContext';
import { Location } from '../services/LocationsService';
import AnnouncementService, {
  Announcement,
} from '../services/AnnouncementService';

export default function useAnnouncements(reload: boolean) {
  const location = useContext(LocationContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoaded(false);
        const announcementsResult = await AnnouncementService.loadAnnouncements(
          {
            id: location?.locationData?.id,
            name: location?.locationData?.name,
          } as Location
        );
        if (announcementsResult) setAnnouncements(announcementsResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAnnouncements();
  }, [location?.locationData?.id, location?.locationData?.name, reload]);
  return { announcements, announcementsLoaded: isLoaded };
}
