import { createContext } from 'react';
import { GetCommentsByOwnerQuery } from '../services/API';

export type CommentContextType = {
  comments: NonNullable<
    NonNullable<GetCommentsByOwnerQuery['getCommentsByOwner']>['items']
  >;
  setComments: (data: CommentContextType['comments']) => void;
};

export const CommentContext = createContext<CommentContextType>({
  comments: [],
  setComments: () => null,
});

export default CommentContext;
