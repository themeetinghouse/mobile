import API, {
  graphqlOperation,
  GraphQLResult,
  GRAPHQL_AUTH_MODE,
} from '@aws-amplify/api';
import { GetNotesQuery, ListNotesQuery, Notes, SearchNotesQuery } from './API';
import {
  checkIfNotesExistQuery,
  getNotes,
  getNotesNoContent,
  getNotesNoContentCustom,
  listNotes,
  searchNotes,
} from './queries';

export default class NotesService {
  static loadNotes = async (
    date: string
  ): Promise<GetNotesQuery['getNotes']> => {
    const notes = (await API.graphql(
      graphqlOperation(getNotes, { id: date })
    )) as GraphQLResult<GetNotesQuery>;
    return notes.data?.getNotes ?? null;
  };

  static loadNotesNoContent = async (
    date: string
  ): Promise<GetNotesQuery['getNotes']> => {
    const notes = (await API.graphql(
      graphqlOperation(getNotesNoContent, { id: date })
    )) as GraphQLResult<GetNotesQuery>;
    return notes.data?.getNotes ?? null;
  };

  static searchForNotes = async (searchTerm: string): Promise<Notes[]> => {
    try {
      const notes = (await API.graphql({
        query: searchNotes,
        variables: {
          limit: 200,
          filter: {
            and: [
              {
                id: { gte: '2021-12-01' },
              },
              {
                or: [
                  { title: { match: searchTerm } },
                  { content: { match: searchTerm } },
                ],
              },
            ],
          },
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      })) as GraphQLResult<SearchNotesQuery>;
      const items = notes.data?.searchNotes?.items ?? [];
      // console.log({ searchForNotes: items });
      return items as Notes[];
    } catch (error) {
      console.error({ searchForNotes: error });
      return [];
    }
  };

  static loadNotesNoContentCustom = async (
    date: string
  ): Promise<GetNotesQuery['getNotes']> => {
    const notes = (await API.graphql(
      graphqlOperation(getNotesNoContentCustom, { id: date })
    )) as GraphQLResult<GetNotesQuery>;
    return notes.data?.getNotes ?? null;
  };

  static checkIfNotesExist = async (date: string): Promise<boolean> => {
    const notes = (await API.graphql(
      graphqlOperation(checkIfNotesExistQuery, { id: date })
    )) as GraphQLResult<GetNotesQuery>;
    return Boolean(notes.data?.getNotes?.id);
  };
}
