//import { GetNotesQuery } from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

export default class NotesService {
  static loadNotes = async (date: string): Promise<any> => {
    const notes = await API.graphql(graphqlOperation(getNotes, { id: date })) as GraphQLResult<any>
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
