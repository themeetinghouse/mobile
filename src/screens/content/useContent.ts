import { useLayoutEffect, useState } from 'react';
import { ContentScreenType, ScreenConfig } from './ContentTypes';
import ErrorScreen from './error';

const defaultScreenConfig: ScreenConfig = {
  hideBottomNav: false,
  hideHeader: false,
  backgroundColor: 'black',
  hideBackButton: false,
  fontColor: 'white',
};
type ContentState = {
  content: ContentScreenType | undefined;
  isLoading: boolean;
};
export default function useContent(screen: string | undefined) {
  const [contentState, setContentState] = useState<ContentState>({
    isLoading: false,
    content: undefined,
  });
  useLayoutEffect(() => {
    const loadJson = async () => {
      if (!contentState?.isLoading) {
        setContentState((prev) => ({ ...prev, isLoading: true }));
      }
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
        setContentState({ content: data, isLoading: false });
      } catch (error) {
        setContentState({
          content: ErrorScreen as ContentScreenType,
          isLoading: false,
        });
      }
    };

    loadJson();

    // isLoading might be stale, TODO: look at this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
  return {
    content: contentState.content,
    items: contentState?.content?.screen?.content,
    isLoading: contentState.isLoading,
    screenConfig: contentState?.content?.screen?.config ?? defaultScreenConfig,
    screenTitle: contentState?.content?.screen?.title ?? '',
  };
}
