import API, {
  graphqlOperation,
  GraphQLResult,
  GRAPHQL_AUTH_MODE,
} from '@aws-amplify/api';
import { runGraphQLQuery } from './ApiService';
import { GetVideoByVideoTypeQuery, SearchVideosQuery, Video } from './API';
import { getVideoByVideoType, searchVideos } from './queries';

export interface LoadSermonResult {
  items: NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items'];
  nextToken: NonNullable<
    GetVideoByVideoTypeQuery['getVideoByVideoType']
  >['nextToken'];
}

export default class SermonsService {
  static searchForSermons = async (searchTerm: string) => {
    const query = {
      query: searchVideos,
      variables: {
        sortDirection: 'DESC',
        limit: 100,
        videoTypes: 'adult-sunday',
        filter: {
          or: [
            { episodeTitle: { match: searchTerm } },
            { seriesTitle: { match: searchTerm } },
          ],
        },
      },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    };
    try {
      const queryResult = (await API.graphql(
        query
      )) as GraphQLResult<SearchVideosQuery>;
      const items = queryResult?.data?.searchVideos?.items ?? [];
      // console.log({ successSermons: items });
      return items as Video[];
    } catch (error) {
      console.error({ error });
      return [];
    }
  };

  static loadSermonsList = async (
    count = 20,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    const query = {
      sortDirection: 'DESC',
      limit: count,
      videoTypes: 'adult-sunday',
      publishedDate: { lt: 'a' },
      nextToken,
    };
    const result = (await API.graphql(
      graphqlOperation(getVideoByVideoType, query)
    )) as GraphQLResult<GetVideoByVideoTypeQuery>;
    return {
      items: result?.data?.getVideoByVideoType?.items ?? [],
      nextToken: result?.data?.getVideoByVideoType?.nextToken ?? '',
    };
  };

  static loadRecentSermonsList = async (
    count = 20,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    return SermonsService.loadSermonsList(count, nextToken);
  };

  static loadHighlightsList = async (
    count = 5,
    nextToken?: string
  ): Promise<LoadSermonResult> => {
    const query = {
      query: getVideoByVideoType,
      variables: {
        sortDirection: 'DESC',
        limit: count,
        videoTypes: 'adult-sunday-shortcut',
        publishedDate: { lt: 'a' },
        nextToken,
      },
    };
    const queryResult = await runGraphQLQuery(query);

    return {
      items: queryResult?.getVideoByVideoType?.items,
      nextToken: queryResult?.getVideoByVideoType?.nextToken,
    };
  };
}
