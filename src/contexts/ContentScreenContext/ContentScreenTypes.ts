import { ScreenConfig } from '../../components/RenderRouter/ContentTypes';

export enum ContentScreenActionType {
  UPDATE_STATE = 'UPDATE_STATE',
  CHECK_STATE = 'CHECK_STATE',
}
export type ContentScreenState = ContentThemeContextType;

export type ContentScreenAction = {
  type: ContentScreenActionType;
  payload?: any;
};
type ContentThemeContextType = {
  fontColor: ScreenConfig['fontColor'];
  hideBottomNav?: ScreenConfig['hideBottomNav'];
  hideHeader?: ScreenConfig['hideHeader'];
  hideBackButton?: ScreenConfig['hideBackButton'];
  backgroundColor: ScreenConfig['backgroundColor'];
  groups: string[];
};
