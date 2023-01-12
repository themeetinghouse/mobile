import { initialState as ModalInitialState } from './ModalContext';
import {
  ModalAction,
  ModalActionType,
  ModalContextState,
} from './ModalContextTypes';

export default function ModalReducer(
  state: ModalContextState,
  action: ModalAction
): ModalContextState {
  switch (action.type) {
    case ModalActionType.CREATE_NEW_MODAL:
      return {
        ...state,
        ...action.payload,
      };
    case ModalActionType.DISMISS_MODAL:
      return { ...ModalInitialState };
    case ModalActionType.SHOW_MODAL:
      return {
        ...state,
        isVisible: true,
      };
    default:
      return state;
  }
}
