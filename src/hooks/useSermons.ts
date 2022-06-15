import { useEffect, useState } from 'react';
import SermonsService, {
  LoadSermonResult,
} from '../../src/services/SermonsService';

export default function useSermons(loadCount = 6, skip = false) {
  const [sermons, setSermons] = useState<LoadSermonResult['items']>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadSermons = async () => {
      try {
        const sermonData = await SermonsService.loadRecentSermonsList(
          loadCount
        );
        if (sermonData.items?.length) setSermons(sermonData.items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    if (skip) setIsLoaded(true);
    else loadSermons();
  }, [loadCount, skip]);
  return {
    sermons,
    sermonsLoaded: isLoaded,
  };
}
