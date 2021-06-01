import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetNotesQuery } from './API';
import {
  checkIfNotesExistQuery,
  getNotes,
  getNotesNoContent,
  getNotesNoContentCustom,
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
