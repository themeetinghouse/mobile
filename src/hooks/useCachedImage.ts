import { useState, useEffect, useMemo } from 'react';
import * as FileSystem from 'expo-file-system';
import shortHash from 'shorthash2';

export default function useCachedImage(url: string, cacheKey: string) {
  const [uri, setUri] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const memoizedURI = useMemo(() => {
    return uri;
  }, [uri]);
  const memoizedURL = useMemo(() => {
    return url;
  }, [url]);
  const memoizedKey = useMemo(() => {
    return cacheKey;
  }, [cacheKey]);
  useEffect(() => {
    (async function checkCache() {
      try {
        const name = shortHash(memoizedKey);
        const path = `${FileSystem.cacheDirectory}${name}`;
        const image = await FileSystem.getInfoAsync(path);
        if (image.exists) {
          console.log({ success: image.uri });
          setUri(image.uri);
          return;
        }
        // console.warn('Image doesnt exist!', { memoizedURL }, { name });
        console.warn({ path });
        // const newImage = await FileSystem.downloadAsync(memoizedURI, path);
        setUri(url);
      } catch (error) {
        console.error({ error });
        setUri(memoizedURL);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url, memoizedKey, memoizedURI, memoizedURL]);
  return { isLoading, uri, setUri };
}
