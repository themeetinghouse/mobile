import { useEffect, useState } from 'react';
import SeriesService, {
  LoadSeriesListData,
} from '../../src/services/SeriesService';

export default function useRecentSeries(loadCount = 10, skip = false) {
  const [recentSeries, setRecentSeries] = useState<LoadSeriesListData['items']>(
    []
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined | null>();
  const loadMore = async () => {
    if (!nextToken) return;
    try {
      const seriesData = await SeriesService.loadSeriesList(
        loadCount,
        nextToken
      );
      if (seriesData.items?.length)
        setRecentSeries((prev) => [
          ...(prev ?? []),
          ...(seriesData?.items ?? []),
        ]);
      setNextToken(seriesData.nextToken);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoaded(true);
    }
  };
  useEffect(() => {
    const loadSeries = async () => {
      try {
        const seriesData = await SeriesService.loadSeriesList(loadCount);
        if (seriesData.items?.length) setRecentSeries(seriesData.items);
        setNextToken(seriesData.nextToken);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    if (skip) setIsLoaded(true);
    else loadSeries();
  }, [loadCount, skip]);
  return {
    recentSeries,
    recentSeriesLoaded: isLoaded,
    loadMore,
  };
}
