import { runGraphQLQuery } from './ApiService';
import { GetVideoByVideoTypeQuery } from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

export interface LoadSermonResult {
  items: NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items'];
  nextToken: NonNullable<
    GetVideoByVideoTypeQuery['getVideoByVideoType']
  >['nextToken'];
}

export default class SermonsService {
  static loadSermonsList = async (
    count = 20,
    nextToken?: string
  ): Promise<any> => {
    const query = {
      sortDirection: 'DESC',
      limit: count,
      videoTypes: 'adult-sunday',
      publishedDate: { lt: 'a' },
      nextToken: nextToken,
    };
    try {
      const result = (await API.graphql(
        graphqlOperation(getVideoByVideoType, query)
      )) as GraphQLResult<GetVideoByVideoTypeQuery>;
      return {
        items: result?.data?.getVideoByVideoType?.items,
        nextToken: result?.data?.getVideoByVideoType?.nextToken,
      };
    } catch (e) {
      console.debug(e);
    }
  };

  static loadRecentSermonsList = async (
    count = 20,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    return SermonsService.loadSermonsList(count, nextToken);
  };

  static loadSermonsInSeriesList = async (
    seriesTitle: string,
    count = 99999,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    const query = {
      query: getVideoByVideoType,
      variables: {
        sortDirection: 'DESC',
        limit: count,
        videoTypes: 'adult-sunday',
        publishedDate: { lt: 'a' },
        filter: { seriesTitle: { eq: seriesTitle } },
      },
    };
    const queryResult = await runGraphQLQuery(query);
    return {
      items: queryResult.getVideoByVideoType.items,
      nextToken: queryResult.getVideoByVideoType.nextToken,
    };
  };

  static loadHighlightsList = async (
    count = 20,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    const query = {
      query: getVideoByVideoType,
      variables: {
        sortDirection: 'DESC',
        limit: count,
        videoTypes: 'adult-sunday-shortcut',
        publishedDate: { lt: 'a' },
        nextToken: nextToken,
      },
    };
    const queryResult = await runGraphQLQuery(query);

    return {
      items: queryResult.getVideoByVideoType.items,
      nextToken: queryResult.getVideoByVideoType.nextToken,
    };
  };
}

export const getVideoByVideoType = /* GraphQL */ `
  query GetVideoByVideoType(
    $videoTypes: String
    $publishedDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVideoByVideoType(
      videoTypes: $videoTypes
      publishedDate: $publishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdBy
        createdDate
        episodeTitle
        originalEpisodeTitle
        episodeNumber
        seriesTitle
        publishedDate
        recordedDate
        description
        closedCaptioning
        referencedMedia
        campaigns
        bibleVerses
        topics
        qandeh
        length
        YoutubeIdent
        Youtube {
          id
          kind
          etag
          snippet {
            publishedAt
            channelId
            title
            description
            thumbnails {
              default {
                url
                width
                height
              }
              medium {
                url
                width
                height
              }
              high {
                url
                width
                height
              }
              standard {
                url
                width
                height
              }
              maxres {
                url
                width
                height
              }
            }
            channelTitle
            localized {
              title
              description
            }
          }
          contentDetails {
            videoId
            videoPublishedAt
            duration
            dimension
            definition
            caption
            licensedContent
            projection
          }
          status {
            uploadStatus
            privacyStatus
            license
            embeddable
            publicStatsViewable
          }
        }
        videoTypes
        notesURL
        videoURL
        audioURL
        speakers {
          items {
            id
            speaker {
              id
              name
              image
              videos {
                items {
                  id
                }
                nextToken
              }
            }
          }
          nextToken
        }
        series {
          id
          seriesType
          title
          description
          image
          startDate
          endDate
        }
      }
      nextToken
    }
  }
`;
