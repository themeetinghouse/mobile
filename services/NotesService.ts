//import { GetNotesQuery } from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetNotesQuery } from './API';

export default class NotesService {
  static loadNotes = async (date: string): Promise<GetNotesQuery['getNotes'] | undefined> => {
    const notes = await API.graphql(graphqlOperation(getNotes, { id: date })) as GraphQLResult<GetNotesQuery>;
    return notes.data?.getNotes;
  }
}

const getNotes = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      title
      content
      questions
      jsonContent
      jsonQuestions
      episodeDescription
      episodeNumber
      seriesId
      pdf
      topics
      tags
      createdAt
      updatedAt
      verses {
        items {
          id
          key
          offset
          length
          dataType
          content
          youVersionUri
          noteId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
