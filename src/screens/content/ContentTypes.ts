export type ContentItemType =
  | HeaderType
  | ImageType
  | BodyType
  | SpacingType
  | ButtonType
  | VideoType
  | TMHLogoType
  | CustomPlaylistType
  | LinkItemType
  | Divider;

export type CustomPlaylistType = {
  type: 'custom-playlist';
  sortOrder: 'ASC' | 'DESC';
  subclass: string;
  header?: string;
  subheader?: string;
};
export type TMHLogoType = {
  type: 'logo';
  style: 'white' | 'black';
  centered?: boolean;
};
export type HeaderType = {
  type: 'header';
  style: 'header1' | 'header2' | 'header3' | 'header4' | 'header5';
  text: string;
};
export type BodyType = {
  type: 'body';
  style: 'small' | 'medium' | 'large';
  text: string;
  bold?: boolean;
};

export type VideoType = {
  type: 'video';
  style?: 'full';
  youtubeID: string;
};

export type LinkItemType = {
  type: 'link-item';
  navigateTo?: string;
  text: string;
  groups?: string[];
  subtext: string;
  hideBorder?: boolean;
  icon: string;
};
export type Divider = {
  type: 'divider';
};
export type SpacingType = {
  type: 'spacing';
  size: number;
};

type ButtonStyle = 'black' | 'white' | 'withArrow' | 'white-link-with-icon';
type ScreenBackgroundColor = 'black' | 'white';
type ScreenFontColor = 'white' | 'black';

export type ButtonType = {
  type: 'button';
  style: ButtonStyle;
  label: string;
  icon?: string;
  navigateTo?: string;
};

export type ImageType = {
  type: 'image';
  style: 'full' | 'default';
  imageUrl: string;
  imageAlt: string;
  navigateTo?: string;
};

export type ScreenConfig = {
  hideBottomNav?: boolean;
  hideHeader?: boolean;
  backgroundColor?: ScreenBackgroundColor;
  hideBackButton?: boolean;
  fontColor?: ScreenFontColor;
};

export type ContentScreenType = {
  screen: {
    title: string;
    config: ScreenConfig;
    content: ContentItemType[];
  };
};
