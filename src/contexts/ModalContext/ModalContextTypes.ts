export enum ModalActionType {
  CREATE_NEW_MODAL = 'CREATE_NEW_MODAL',
  DISMISS_MODAL = 'DISMISS_MODAL',
  SHOW_MODAL = 'SHOW_MODAL',
}

export type ModalAction = {
  type: ModalActionType;
  payload?: any;
};

export type ModalContextState = {
  isVisible: boolean;
  body: string;
  title: string;
  action?: () => void;
  actionLabel?: string;
  dismissActionLabel?: string;
  dismiss?: () => void;
};
