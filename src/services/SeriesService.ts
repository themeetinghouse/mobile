import { runGraphQLQuery } from './ApiService';
import {
  GetSeriesBySeriesTypeQuery,
  GetSeriesQuery,
  ListCustomPlaylistsQuery,
} from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

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

type PlaylistData = NonNullable<
  NonNullable<ListCustomPlaylistsQuery['listCustomPlaylists']>['items']
>;

type SeriesData = NonNullable<GetSeriesQuery['getSeries']>;

interface SeriesDataWithHeroImage extends SeriesData {
  heroImage?: string;
  image640px?: string;
}

export default class SeriesService {
  static loadCustomPlaylists = async (
    limit: number,
    nextToken?: string
  ): Promise<LoadPlaylistData> => {
    const queryResult = (await API.graphql(
      graphqlOperation(listCustomPlaylists, {
        sortDirection: 'DESC',
        limit: limit,
        seriesType: 'adult-sunday',
        nextToken: nextToken,
      })
    )) as any;
    const items = queryResult?.data?.listCustomPlaylists?.items;
    if (items) {
      for (const item of items) {
        if (item) {
          item.image =
            'https://www.themeetinghouse.com/cache/640/static/photos/playlists/The%20Bible.png';
          SeriesService.updateSeriesImageFromPlaylist(item as any);
        }
      }
    }
    return {
      items: items?.filter(
        (item: any) => item?.videos?.items && item?.videos?.items?.length > 0
      ),
      nextToken: queryResult?.data?.listCustomPlaylists?.nextToken,
    };
  };
  static getCustomPlaylistById = async (
    customPlaylistId: string
  ): Promise<PlaylistData> => {
    const queryResult = await runGraphQLQuery({
      query: getCustomPlaylist,
      variables: { id: customPlaylistId },
    });
    //console.log("SeriesService.getCustomPlaylistById(): queryResult = ", queryResult);
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
        limit: limit,
        seriesType: 'adult-sunday',
        nextToken: nextToken,
      })
    )) as GraphQLResult<GetSeriesBySeriesTypeQuery>;

    const items = queryResult?.data?.getSeriesBySeriesType?.items;
    if (items) {
      for (const item of items) {
        if (item) {
          SeriesService.updateSeriesImage(item as any);
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
    //console.log("SeriesService.loadSeriesById(): queryResult = ", queryResult);
    const series = queryResult.getSeries;
    //SeriesService.updateSeriesImage(series);
    return series;
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
        'https://www.themeetinghouse.com/static/NoCompassionLogo.png';
      series.heroImage =
        'https://www.themeetinghouse.com/static/NoCompassionLogo.png';
    }
  };
  static updateSeriesImageFromPlaylist = async (
    series: SeriesDataWithHeroImage
  ): Promise<void> => {
    if (series?.title) {
      series.image = `https://themeetinghouse.com/cache/320/static/photos/playlists/${series.title.replace(
        '?',
        ''
      )}.png`
        .replace(/ /g, '%20')
        .replace("'", '');
      series.image640px = `https://themeetinghouse.com/cache/640/static/photos/playlists/${series.title.replace(
        '?',
        ''
      )}.png`
        .replace(/ /g, '%20')
        .replace("'", '');
      series.heroImage = `https://www.themeetinghouse.com/static/photos/playlists/${series.title.replace(
        / /g,
        '%20'
      )}.png`;
    } else {
      series.image =
        'https://www.themeetinghouse.com/static/NoCompassionLogo.png';
      series.heroImage =
        'https://www.themeetinghouse.com/static/NoCompassionLogo.png';
    }
  };
}

const getSeriesBySeriesType = `
  query getSeriesBySeriesType(
    $seriesType: String, 
    $startDate: ModelStringKeyConditionInput, 
    $sortDirection: ModelSortDirection, 
    $filter: ModelSeriesFilterInput, 
    $limit: Int, 
    $nextToken: String
  ) {
    getSeriesBySeriesType(seriesType: $seriesType, startDate: $startDate, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        seriesType
        title
        description
        image
        startDate
        endDate
        videos {
          items {
            id
            episodeTitle
            episodeNumber
            seriesTitle
            series {
              id
            }
            publishedDate
            description
            length
            YoutubeIdent
            videoTypes
            notesURL
            videoURL
            audioURL
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getSeries = `
  query GetSeries($id: ID!) {
    getSeries(id: $id) {
      id
      seriesType
      title
      description
      image
      startDate
      endDate
      videos {
        items {
          id
          episodeTitle
          episodeNumber
          seriesTitle
          series {
            id
          }
          publishedDate
          description
          length
          YoutubeIdent
          videoTypes
          notesURL
          videoURL
          audioURL
        }
        nextToken
      }
    }
  }
`;

export const listCustomPlaylists = /* GraphQL */ `
  query ListCustomPlaylists(
    $filter: ModelCustomPlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        seriesType
        title
        description
        thumbnailDescription
        createdAt
        updatedAt
        videos {
          items {
            id
            videoID
            customPlaylistID
            customPlaylist {
              id
              seriesType
              title
              thumbnailDescription
              videos {
                items {
                  id
                  videoID
                  customPlaylistID
                }
                nextToken
              }
            }
            video {
              id
              createdBy
              createdDate
              episodeTitle
              originalEpisodeTitle
              episodeNumber
              seriesTitle
              customPlaylistIDs
              publishedDate
              recordedDate
              description
              viewCount
              length
              YoutubeIdent
              videoTypes
              notesURL
              videoURL
              audioURL
              thumbnailDescription
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getCustomPlaylist = /* GraphQL */ `
  query GetCustomPlaylist($id: ID!) {
    getCustomPlaylist(id: $id) {
      id
      seriesType
      title
      description
      videos {
        items {
          id
          video {
            id
            episodeTitle
            originalEpisodeTitle
            episodeNumber
            seriesTitle
            publishedDate
            description
            Youtube {
              snippet {
                thumbnails {
                  high {
                    url
                  }
                  standard {
                    url
                  }
                  maxres {
                    url
                  }
                }
              }
            }
            videoURL
            audioURL
          }
        }
        nextToken
      }
    }
  }
`;
