import { GetNotesQuery } from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api'; 

export default class NotesService {
  static loadNotes = async (date: string): Promise< NonNullable<GetNotesQuery['getNotes']>['jsonContent'] | undefined> => {
    const notes = await API.graphql(graphqlOperation(getNotes, { id: date })) as GraphQLResult<GetNotesQuery>
    return notes.data?.getNotes?.jsonContent;
  }

  static loadQuestions = async (date: string): Promise<NonNullable<GetNotesQuery['getNotes']>['jsonQuestions'] | undefined> => {
    const notes = await API.graphql(graphqlOperation(getNotes, { id: date })) as GraphQLResult<GetNotesQuery>
    return notes.data?.getNotes?.jsonQuestions;
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
    }
  }
`;
