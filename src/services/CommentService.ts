import { GraphQLResult, GRAPHQL_AUTH_MODE, API } from '@aws-amplify/api';
import { Comment, SearchCommentsQuery } from './API';
import { searchComments } from './queries';

export default class CommentService {
  static searchForComments = async (searchTerm: string): Promise<Comment[]> => {
    try {
      const comments = (await API.graphql({
        query: searchComments,
        variables: { limit: 200, filter: { comment: { match: searchTerm } } },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as GraphQLResult<SearchCommentsQuery>;
      const items = comments.data?.searchComments?.items ?? [];
      // console.log({ searchForComments: items });
      return items as Comment[];
    } catch (error) {
      console.error({ searchForComments: error });
      return [];
    }
  };
}
