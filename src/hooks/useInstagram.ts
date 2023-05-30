import { useContext, useEffect, useState } from 'react';
import LocationContext from '../../src/contexts/LocationContext';
import InstagramService, { InstagramData } from '../../src/services/Instagram';

export default function useInstagram(reload: boolean) {
  const location = useContext(LocationContext);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadInstagramImages = async () => {
      try {
        setIsLoaded(false);
        console.log({ instagramByLocation: location });
        const data = await InstagramService.getInstagramByLocation(
          location?.locationData
        );
        setImages(data.images);
        setInstaUsername(data.username);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadInstagramImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.locationData?.id, reload]);
  return { images, instaUsername, instaLoaded: isLoaded };
}
