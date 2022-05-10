import { useLayoutEffect, useState } from 'react';
import {
  ContentScreenType,
  ScreenConfig,
} from '../../components/RenderRouter/ContentTypes';
import ErrorScreen from '../../components/RenderRouter/error';

export const controllerWithOptionalTimeout = (timeoutInSeconds = 0) => {
  const controller = new AbortController();
  const signalWithTimeout = () => {
    setTimeout(() => controller.abort(), timeoutInSeconds * 1000);
    return controller;
  };
  return { controller, signalWithTimeout };
};

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
    const { controller, signalWithTimeout } = controllerWithOptionalTimeout(5);
    const loadJson = async () => {
      setContentState((prev) => ({ ...prev, isLoading: true }));
      let fileLoc = screen;
      if (!fileLoc) fileLoc = 'featured';
      try {
        const jsonData = await fetch(
          `https://www.themeetinghouse.com/static/app/content/${fileLoc}.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'cache-control': 'no-cache',
            },
            signal: signalWithTimeout().signal,
            cache: 'no-cache',
          } as RequestInit
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
    return () => {
      controller.abort();
    };
  }, [screen]);
  return {
    content: contentState.content,
    items: contentState?.content?.screen?.content,
    isLoading: contentState.isLoading,
    screenConfig: contentState?.content?.screen?.config ?? defaultScreenConfig,
    screenTitle: contentState?.content?.screen?.title ?? '',
  };
}
