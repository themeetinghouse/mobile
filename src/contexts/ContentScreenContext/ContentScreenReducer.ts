import {
  ContentScreenAction,
  ContentScreenState,
  ContentScreenActionType,
} from './ContentScreenTypes';

export default function contentScreenReducer(
  state: ContentScreenState,
  action: ContentScreenAction
): ContentScreenState {
  switch (action.type) {
    case ContentScreenActionType.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case ContentScreenActionType.CHECK_STATE:
      console.log({ state });
      return state;
    default:
      return state;
  }
}
