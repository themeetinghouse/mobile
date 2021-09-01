import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { SuggestedVideos } from 'src/screens/teaching/TeachingScreen';
import { runGraphQLQuery } from './ApiService';
import {
  GetCustomPlaylistQuery,
  GetCustomPlaylistQueryVariables,
  GetSeriesBySeriesTypeQuery,
  GetSeriesQuery,
  ListCustomPlaylistsQuery,
} from './API';
import {
  listCustomPlaylists,
  getCustomPlaylist,
  getSeriesBySeriesType,
  getSeriesEpisodeCount,
  getSeries,
  listCustomPlaylistsForRandom,
} from './queries';

type SeriesByTypeQueryResult = NonNullable<
  GetSeriesBySeriesTypeQuery['getSeriesBySeriesType']
>;

export interface LoadSeriesListData {
  items:
    | Array<
        NonNullable<SeriesByTypeQueryResult['items']>[0] | { loading: boolean }
      >
    | undefined;
  nextToken: SeriesByTypeQueryResult['nextToken'] | undefined;
}

export interface LoadPlaylistData {
  items:
    | Array<
        NonNullable<ListCustomPlaylistsQuery['listCustomPlaylists']>['items']
      >
    | undefined;
  nextToken: NonNullable<
    ListCustomPlaylistsQuery['listCustomPlaylists']
  >['nextToken'];
}

export type CustomPlaylist = GetCustomPlaylistQuery['getCustomPlaylist'];

type SeriesData = NonNullable<GetSeriesQuery['getSeries']>;

export interface SeriesHighlights {
  items: NonNullable<
    NonNullable<NonNullable<GetSeriesQuery['getSeries']>['videos']>['items']
  >;
  nextToken: NonNullable<
    NonNullable<NonNullable<GetSeriesQuery['getSeries']>['videos']>['nextToken']
  >;
  loading?: boolean;
}

export interface SeriesDataWithHeroImage extends SeriesData {
  heroImage?: string;
  image640px?: string;
}

export default class SeriesService {
  static loadSeriesHighlights = async (
    count = 20,
    seriesTitle: string,
    nextToken?: string
  ): Promise<SeriesHighlights> => {
    const variables = {
      limit: count,
      id: `adult-sunday-shortcut-${seriesTitle}`,
      nextToken,
    };
    const queryResult = (await API.graphql(
      graphqlOperation(getSeries, variables)
    )) as GraphQLResult<GetSeriesQuery>;
    return {
      items: queryResult.data?.getSeries?.videos?.items ?? [],
      nextToken: queryResult.data?.getSeries?.videos?.nextToken ?? '',
    };
  };

  static generateNum = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  static getCustomPlaylistById = async (
    customPlaylistId: string
  ): Promise<CustomPlaylist> => {
    const queryResult = (await API.graphql({
      query: getCustomPlaylist,
      variables: { id: customPlaylistId },
    })) as GraphQLResult<GetCustomPlaylistQuery>;
    const series = queryResult?.data?.getCustomPlaylist;
    return series ?? null;
  };

  static loadRandomPlaylist = async (): Promise<SuggestedVideos> => {
    const queryResult = (await API.graphql(
      graphqlOperation(listCustomPlaylistsForRandom, {
        sortDirection: 'DESC',
        seriesType: 'adult-sunday',
      })
    )) as GraphQLResult<ListCustomPlaylistsQuery>;
    const items = queryResult?.data?.listCustomPlaylists?.items;
    const filteredItems = items?.filter(
      (item) => item?.videos?.items && item?.videos?.items?.length > 0
    );
    const numberItems = filteredItems?.length ?? 3;
    const random = SeriesService.generateNum(numberItems);
    const seriesName = filteredItems?.[random]?.id ?? '';

    const playlistResult = await SeriesService.getCustomPlaylistById(
      seriesName
    );
    return playlistResult?.videos?.items ?? [];
  };

  static loadCustomPlaylists = async (
    limit: number,
    nextToken?: string
  ): Promise<CustomPlaylist> => {
    const queryResult = (await API.graphql(
      graphqlOperation(listCustomPlaylists, {
        sortDirection: 'DESC',
        limit,
        seriesType: 'adult-sunday',
        nextToken,
      })
    )) as GraphQLResult<ListCustomPlaylistsQuery>;
    const items = queryResult?.data?.listCustomPlaylists?.items;
    if (items) {
      items.forEach((item) => {
        if (item) {
          SeriesService.updateSeriesImageFromPlaylist(item as any);
        }
      });
    }
    return {
      items:
        items?.filter(
          (item) => item?.videos?.items && item?.videos?.items?.length > 0
        ) ?? [],
      nextToken: queryResult?.data?.listCustomPlaylists?.nextToken ?? '',
    };
  };

  static getCustomPlaylistById = async (
    customPlaylistId: string
  ): Promise<PlaylistData> => {
    const queryResult = await runGraphQLQuery({
      query: getCustomPlaylist,
      variables: { id: customPlaylistId },
    });
    const series = queryResult.getCustomPlaylist;
    await SeriesService.updateSeriesImageFromPlaylist(series);
    return series;
  };

  static fetchPopularSeries = async (): Promise<
    Array<SeriesDataWithHeroImage>
  > => {
    const res = await fetch(
      'https://www.themeetinghouse.com/static/content/teaching.json'
    );
    const data = await res.json();
    // TODO: does this need typing?
    const findSeries =
      data?.page?.content?.filter((a) => a?.collection)[0]?.collection ?? [];

    const arr: Array<Promise<SeriesDataWithHeroImage>> = [];
    findSeries.forEach(async (seriesName: string) => {
      arr.push(SeriesService.loadSeriesById(seriesName));
    });
    return Promise.all(arr).then((series) => {
      return series;
    });
  };


  static loadSeriesList = async (
    limit: number,
    nextToken?: string
  ): Promise<LoadSeriesListData> => {
    const queryResult = (await API.graphql(
      graphqlOperation(getSeriesBySeriesType, {
        sortDirection: 'DESC',
        limit,
        seriesType: 'adult-sunday',
        nextToken,
      })
    )) as GraphQLResult<GetSeriesBySeriesTypeQuery>;

    const items = queryResult?.data?.getSeriesBySeriesType?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        SeriesService.updateSeriesImage(items[i] as SeriesData);
      }
    }
    return {
      items: items?.filter(
        (item) => item?.videos?.items && item?.videos?.items?.length > 0
      ),
      nextToken: queryResult?.data?.getSeriesBySeriesType?.nextToken,
    };
  };

  static loadSeriesById = async (
    seriesId: string
  ): Promise<SeriesDataWithHeroImage> => {
    const queryResult = await runGraphQLQuery({
      query: getSeries,
      variables: { id: seriesId },
    });
    const series = queryResult.getSeries;
    await SeriesService.updateSeriesImage(series as SeriesData);
    return series;
  };

  static getSeriesEpisodeCount = async (seriesId: string): Promise<number> => {
    const queryResult = await runGraphQLQuery({
      query: getSeriesEpisodeCount,
      variables: { id: seriesId },
    });
    const episodeCount = queryResult.getSeries?.videos?.items?.length ?? 0;
    return episodeCount;
  };

  static updateSeriesImage = async (
    series: SeriesDataWithHeroImage
  ): Promise<void> => {
    if (series?.title) {
      series.image = `https://themeetinghouse.com/cache/320/static/photos/series/adult-sunday-${series.title.replace(
        '?',
        ''
      )}.jpg`;
      series.image640px = `https://themeetinghouse.com/cache/640/static/photos/series/adult-sunday-${series.title.replace(
        '?',
        ''
      )}.jpg`;
      series.heroImage = `https://www.themeetinghouse.com/static/photos/series/baby-hero/adult-sunday-${series.title.replace(
        / /g,
        '%20'
      )}.jpg`;
    } else {
      series.image =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
      series.heroImage =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
    }
  };

  static updateSeriesImageFromPlaylist = async (
    series: SeriesDataWithHeroImage
  ): Promise<void> => {
    if (series?.title) {
      series.image =
        `https://themeetinghouse.com/cache/320/static/photos/playlists/${series.title.replace(
          '?',
          ''
        )}.jpg`
          .replace(/ /g, '%20')
          .replace("'", '');
      series.image640px =
        `https://themeetinghouse.com/cache/640/static/photos/playlists/${series.title.replace(
          '?',
          ''
        )}.jpg`
          .replace(/ /g, '%20')
          .replace("'", '');
      series.heroImage = `https://www.themeetinghouse.com/static/photos/playlists/${series.title.replace(
        / /g,
        '%20'
      )}.jpg`;
    } else {
      series.image =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
      series.heroImage =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
    }
  };
}
