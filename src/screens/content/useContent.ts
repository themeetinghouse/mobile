import { useEffect, useState } from 'react';
import { ContentScreenType, ScreenConfig } from './ContentTypes';
import ErrorScreen from '../../../assets/json/error';

const defaultScreenConfig: ScreenConfig = {
  hideBottomNav: false,
  hideHeader: false,
  backgroundColor: 'black',
  hideBackButton: false,
  fontColor: 'white',
};
export default function useContent(screen: string | undefined) {
  const [content, setContent] = useState<ContentScreenType>();
  const [isLoading, setIsLoading] = useState(false);
  const items = content?.screen?.content;
  const screenTitle = content?.screen?.title ?? '';
  const screenConfig = content?.screen?.config ?? defaultScreenConfig;
  useEffect(() => {
    const loadJson = async () => {
      if (!isLoading) setIsLoading(true);
      let fileLoc = screen;
      if (!fileLoc) fileLoc = 'featured';
      try {
        const jsonData = await fetch(
          `http://192.168.50.249/json/${fileLoc}.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'cache-control': 'no-cache',
            },
            cache: 'no-cache',
          } as RequestInit & { cache?: string } // why?
        );
        const data = await jsonData.json();
        setIsLoading(false);
        setContent(data);
      } catch (error) {
        setContent(ErrorScreen as ContentScreenType);
        setIsLoading(false);
      }
    };
    loadJson();
    // isLoading might be stale, TODO: look at this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
  return { content, items, isLoading, screenConfig, screenTitle };
}
