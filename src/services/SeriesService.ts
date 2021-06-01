import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { runGraphQLQuery } from './ApiService';
import {
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

type PlaylistItem = NonNullable<
  NonNullable<
    NonNullable<ListCustomPlaylistsQuery>['listCustomPlaylists']
  >['items']
>[0];

type CustomPlaylist = {
  items: Array<PlaylistItem>;
  nextToken: NonNullable<
    NonNullable<ListCustomPlaylistsQuery>['listCustomPlaylists']
  >['nextToken'];
};
type PlaylistData = NonNullable<
  NonNullable<ListCustomPlaylistsQuery['listCustomPlaylists']>['items']
>;

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

interface SeriesDataWithHeroImage extends SeriesData {
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
      for (const item of items) {
        if (item) {
          SeriesService.updateSeriesImage(item as SeriesData);
        }
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
      series.image = `https://themeetinghouse.com/cache/320/static/photos/playlists/${series.title.replace(
        '?',
        ''
      )}.jpg`
        .replace(/ /g, '%20')
        .replace("'", '');
      series.image640px = `https://themeetinghouse.com/cache/640/static/photos/playlists/${series.title.replace(
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
