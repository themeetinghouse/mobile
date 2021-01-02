export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      comment
      tags
      noteType
      commentType
      noteId
      textSnippet
      imageUri
      key
      date
      time
      owner
      createdAt
      updatedAt
    }
  }
`;

export const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      comment
      tags
      noteType
      commentType
      noteId
      textSnippet
      imageUri
      key
      date
      time
      owner
      createdAt
      updatedAt
    }
  }
`;

export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
      comment
      tags
      noteType
      commentType
      noteId
      textSnippet
      imageUri
      key
      date
      time
      owner
      createdAt
      updatedAt
    }
  }
`;
