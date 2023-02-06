import {
  ModalAction,
  ModalActionType,
  ModalContextState,
} from './ModalContextTypes';

export const initialState: ModalContextState = {
  isVisible: false,
  action: () => null,
  actionLabel: '',
  dismiss: () => null,
  dismissActionLabel: '',
  title: '',
  body: '',
};

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
      return { ...initialState };
    case ModalActionType.SHOW_MODAL:
      return {
        ...state,
        isVisible: true,
      };
    default:
      return state;
  }
}
