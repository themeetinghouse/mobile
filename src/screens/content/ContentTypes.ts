export type ContentItemType =
  | HeaderType
  | ImageType
  | BodyType
  | SpacingType
  | ListType
  | ButtonType
  | VideoType
  | TMHLogoType;

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
  style: 'full';
  youtubeID: string;
};

export type ListItemType = {
  type: 'link-item';
  screen: string;
  text: string;
  groups: string[];
  subtext: string;
  hideBorder?: boolean;
  icon: string;
};
export type ListType = {
  type: 'list';
  style: 'link-list' | unknown;
  items: ListItemType[];
};
export type SpacingType = {
  type: 'spacing';
  size: number;
};

type ButtonStyle = 'black' | 'white' | 'withArrow';
type ScreenBackgroundColor = 'black' | 'white';

export type ButtonType = {
  type: 'button';
  style: ButtonStyle;
  label: string;
  navigateTo: string;
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
  fontColor?: 'black' | 'white';
};

export type ContentScreenType = {
  screen: {
    title: string;
    config: ScreenConfig;
    content: ContentItemType[];
  };
};
