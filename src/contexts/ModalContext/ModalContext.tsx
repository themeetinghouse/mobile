import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import ModalContextReducer, { initialState } from './ModalContextReducer';
import {
  ModalAction,
  ModalActionType,
  ModalContextState,
} from './ModalContextTypes';

const ModalContext = createContext<{
  state: ModalContextState;
  dispatch: Dispatch<ModalAction>;
  dismissModal: () => void;
  newModal: (initialState: ModalContextState) => void;
}>({
  state: initialState,
  dispatch: () => null,
  dismissModal: () => null,
  newModal: (initialState: ModalContextState) => null,
});

export const useModalContext = () => {
  return useContext(ModalContext);
};

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ModalContextReducer, initialState);
  const dismissModal = () => {
    dispatch({
      type: ModalActionType.DISMISS_MODAL,
    });
  };
  const newModal = (modalInfo: ModalContextState) => {
    dispatch({
      type: ModalActionType.CREATE_NEW_MODAL,
      payload: modalInfo,
    });
  };
  const memoizedValue = React.useMemo(
    () => ({ state, dispatch, dismissModal, newModal }),
    [state]
  );
  return (
    <ModalContext.Provider value={memoizedValue}>
      {children}
    </ModalContext.Provider>
  );
};
