import React from 'react';

const fallBackConfig: TeachingConfig = {
  hideSeries: false,
  hideRecentTeaching: false,
  hideHighlightsCarousel: false,
  hidePopularTeachings: true,
  hidePopularSeries: true,
  hideTeachingByTopic: true,
  hideSuggestedVideos: true,
  hideTeachersCarousel: true,
};

export type TeachingConfig = {
  hideSeries: boolean;
  hideRecentTeaching: boolean;
  hideHighlightsCarousel: boolean;
  hidePopularTeachings: boolean;
  hidePopularSeries: boolean;
  hideTeachingByTopic: boolean;
  hideSuggestedVideos: boolean;
  hideTeachersCarousel: boolean;
} | null;

export const useTeachingConfig = () => {
  const [pageConfig, setPageConfig] = React.useState<TeachingConfig>(null);
  React.useEffect(() => {
    const loadPageConfig = async () => {
      try {
        const response = await fetch(
          'https://www.themeetinghouse.com/static/app/data/teaching.config.json'
        );
        const jsonItems: TeachingConfig[] = await response.json();
        const config = jsonItems?.[0] ?? fallBackConfig;
        setPageConfig(config);
      } catch (err) {
        setPageConfig(fallBackConfig);
      }
    };
    loadPageConfig();
  }, []);
  return { pageConfig };
};
