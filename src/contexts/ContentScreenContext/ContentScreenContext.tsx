import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { getUserType } from '../../screens/more/MoreScreen';
import contentScreenReducer from './ContentScreenReducer';
import {
  ContentScreenAction,
  ContentScreenActionType,
  ContentScreenState,
} from './ContentScreenTypes';

const initialState: ContentScreenState = {
  fontColor: 'white',
  backgroundColor: 'black',
  hideBottomNav: false,
  hideHeader: false,
  hideBackButton: false,
  groups: [],
};

const ContentScreenContext = createContext<{
  state: ContentScreenState;
  dispatch: Dispatch<ContentScreenAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useContentContext = () => {
  return useContext(ContentScreenContext);
};

export const ContentScreenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(contentScreenReducer, initialState);
  React.useEffect(() => {
    const getUser = async () => {
      // this should probably live in userContext
      const userGroupData = await getUserType();
      dispatch({
        type: ContentScreenActionType.UPDATE_STATE,
        payload: { groups: userGroupData },
      });
    };
    getUser();
  }, []);
  return (
    <ContentScreenContext.Provider value={{ state, dispatch }}>
      {children}
    </ContentScreenContext.Provider>
  );
};
