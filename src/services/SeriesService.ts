import { graphqlOperation, GraphQLResult, API } from '@aws-amplify/api';
import { SuggestedVideos } from '../screens/teaching/TeachingScreen';
import { runGraphQLQuery } from './ApiService';
import {
  GetCustomPlaylistQuery,
  GetSeriesBySeriesTypeQuery,
  GetSeriesQuery,
  ListCustomPlaylistsQuery,
  SearchSeriesQuery,
  Series,
} from './API';
import {
  listCustomPlaylists,
  getCustomPlaylist,
  getSeriesBySeriesType,
  getSeriesEpisodeCount,
  getSeries,
  listCustomPlaylistsForRandom,
} from './queries';
import { searchSeries } from '../graphql/queries';

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
    seriesTitle: string,
    nextToken?: string,
    count = 20
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
    const queryResult = await runGraphQLQuery({
      query: getCustomPlaylist,
      variables: { id: customPlaylistId },
    });
    let series = queryResult.getCustomPlaylist;
    series = SeriesService.updateSeriesImageFromPlaylist(series);
    return series;
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
  ): Promise<{ items: any; nextToken: string | undefined }> => {
    const queryResult = (await API.graphql(
      graphqlOperation(listCustomPlaylists, {
        sortDirection: 'DESC',
        limit,
        seriesType: 'adult-sunday',
        nextToken,
      })
    )) as GraphQLResult<ListCustomPlaylistsQuery>;
    const items = queryResult?.data?.listCustomPlaylists?.items;
    return {
      items:
        items?.filter(
          (item) => item?.videos?.items && item?.videos?.items?.length > 0
        ) ?? [],
      nextToken: queryResult?.data?.listCustomPlaylists?.nextToken ?? '',
    };
  };

  static fetchPopularSeries = async (): Promise<Series[]> => {
    const res = await fetch(
      'https://www.themeetinghouse.com/static/content/teaching.json'
    );
    const data = await res.json();
    // TODO: does this need typing?
    const findSeries =
      data?.page?.content?.filter((a) => a?.collection)[0]?.collection ?? [];

    const arr: Array<Promise<Series>> = [];
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

    const items = queryResult?.data?.getSeriesBySeriesType?.items ?? [];
    console.log({ series: items });
    return {
      items: items?.filter(
        (item) => item?.videos?.items && item?.videos?.items?.length > 0
      ),
      nextToken: queryResult?.data?.getSeriesBySeriesType?.nextToken,
    };
  };

  static loadSeriesById = async (seriesId: string): Promise<Series> => {
    const queryResult = (await API.graphql({
      query: getSeries,
      variables: { id: seriesId },
    })) as GraphQLResult<GetSeriesQuery>;
    const series = queryResult.data?.getSeries as Series;
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

  static searchForSeries = async (searchTerm: string): Promise<Series[]> => {
    try {
      const response = (await API.graphql({
        query: searchSeries,
        variables: {
          limit: 200,
          filter: {
            title: { match: searchTerm },
            seriesType: { eq: 'adult-sunday' },
          },
          sortDirection: 'DESC',
        },
      })) as GraphQLResult<SearchSeriesQuery>;
      const series = response?.data?.searchSeries?.items ?? [];
      return series as Series[];
    } catch (error) {
      console.error({ searchForSeries: error });
      return [];
    }
  };

  static updateSeriesImageFromPlaylist = (
    series: SeriesDataWithHeroImage
  ): SeriesDataWithHeroImage => {
    const series2 = series;
    if (series2?.title) {
      series2.image =
        `https://themeetinghouse.com/cache/320/static/photos/playlists/${series.title?.replace(
          '?',
          ''
        )}.jpg`
          .replace(/ /g, '%20')
          .replace("'", '');
      series2.image640px =
        `https://themeetinghouse.com/cache/640/static/photos/playlists/${series.title?.replace(
          '?',
          ''
        )}.jpg`
          .replace(/ /g, '%20')
          .replace("'", '');
      series2.heroImage = `https://www.themeetinghouse.com/static/photos/playlists/${series.title?.replace(
        / /g,
        '%20'
      )}.jpg`;
    } else {
      series2.image =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
      series2.heroImage =
        'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg';
    }
    return series2;
  };
}
