import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { runGraphQLQuery } from './ApiService';
import { GetVideoByVideoTypeQuery } from './API';
import { getVideoByVideoType } from './queries';

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
