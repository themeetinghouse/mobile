import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import InstagramFeed from '../home/InstagramFeed';

const instaData = [
  {
    caption: 'mock label 1',
    comments_count: '11',
    id: '17855827526455551',
    like_count: '192',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/145372863_1697413997105257_7107894512468132698_n.jpg?_nc_cat=105&ccb=2&_nc_sid=8ae9d6&_nc_ohc=I59fzAWdaMoAX_oKKjv&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=f54ed73bbb9882439940fb962375e77c&oe=604233A3',
    permalink: 'https://www.instagram.com/p/CKzks_DjnDh/',
    shortcode: 'CKzks_DjnDh',
    thumbnail_url: null,
    timestamp: '2021-02-02T22:02:00+0000',
  },
  {
    caption: 'mock label 2',
    comments_count: '4',
    id: '17886921169971782',
    like_count: '143',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/144236968_2874527672759360_3132331619304084158_n.jpg?_nc_cat=109&ccb=2&_nc_sid=8ae9d6&_nc_ohc=P0k3mXw6kUcAX9OnMem&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=7e1a2f4437fbe5e8a70f02b6c6472945&oe=6042E3C6',
    permalink: 'https://www.instagram.com/p/CKq_WXYsNar/',
    shortcode: 'CKq_WXYsNar',
    thumbnail_url: null,
    timestamp: '2021-01-30T14:01:39+0000',
  },
  {
    caption: 'mock label 3',
    comments_count: '6',
    id: '17980680469339634',
    like_count: '316',
    media_type: 'CAROUSEL_ALBUM',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/143304653_858167404726503_5048110511012021886_n.jpg?_nc_cat=101&ccb=2&_nc_sid=8ae9d6&_nc_ohc=zBf73vuegDUAX_0vx19&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=ff5d9fceadd235211ddb3540cdc94434&oe=60432679',
    permalink: 'https://www.instagram.com/p/CKpDr8yM_O2/',
    shortcode: 'CKpDr8yM_O2',
    thumbnail_url: null,
    timestamp: '2021-01-29T20:00:29+0000',
  },
  {
    caption: 'mock label 4',
    comments_count: '2',
    id: '17866893440283012',
    like_count: '133',
    media_type: 'CAROUSEL_ALBUM',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/142998934_2485890091715689_3713114072043320863_n.jpg?_nc_cat=111&ccb=2&_nc_sid=8ae9d6&_nc_ohc=1sINqAqXYhgAX8emcx_&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=b980760914082c01632a62f9da5941e2&oe=6042CFA9',
    permalink: 'https://www.instagram.com/p/CKmKP7mj1IY/',
    shortcode: 'CKmKP7mj1IY',
    thumbnail_url: null,
    timestamp: '2021-01-28T17:00:06+0000',
  },
  {
    caption: 'mock label 5',
    comments_count: '0',
    id: '17903893762714080',
    like_count: '66',
    media_type: 'CAROUSEL_ALBUM',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/143246870_459802675151826_8328121703670862151_n.jpg?_nc_cat=106&ccb=2&_nc_sid=8ae9d6&_nc_ohc=axLWEYX5A0IAX9g2Ql4&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=bc44bcc162c18aea0fb6b3f73899742e&oe=6042C6ED',
    permalink: 'https://www.instagram.com/p/CKhCsQdlvFV/',
    shortcode: 'CKhCsQdlvFV',
    thumbnail_url: null,
    timestamp: '2021-01-26T17:17:52+0000',
  },
  {
    caption: 'mock label 6',
    comments_count: '1',
    id: '18140168173134855',
    like_count: '253',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/141311072_2825909344314669_7111085370817907148_n.jpg?_nc_cat=107&ccb=2&_nc_sid=8ae9d6&_nc_ohc=SHjvcFJx7qIAX91xx3X&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=78d810e21a562420ce0bb2fb0aad5c26&oe=60412C06',
    permalink: 'https://www.instagram.com/p/CKY-PnPrKGj/',
    shortcode: 'CKY-PnPrKGj',
    thumbnail_url: null,
    timestamp: '2021-01-23T14:05:14+0000',
  },
  {
    caption: 'mock label 7',
    comments_count: '1',
    id: '17895418552809822',
    like_count: '139',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/141106719_918973682172491_5692715271187105972_n.jpg?_nc_cat=106&ccb=2&_nc_sid=8ae9d6&_nc_ohc=p7nbsmbZnSsAX-2y7ry&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=d36848b891db29b3eed5a711b4837385&oe=6042C2AA',
    permalink: 'https://www.instagram.com/p/CKXP61PFG8-/',
    shortcode: 'CKXP61PFG8-',
    thumbnail_url: null,
    timestamp: '2021-01-22T22:01:48+0000',
  },
  {
    caption: 'mock label 8',
    comments_count: '0',
    id: '17843764976513640',
    like_count: '50',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/141092966_501537257502007_7800873007797386215_n.jpg?_nc_cat=105&ccb=2&_nc_sid=8ae9d6&_nc_ohc=VYowmoI7W2UAX8sTgsZ&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=30b8f06c2e06dc38c5b3dbfe80e1dac6&oe=604207C6',
    permalink: 'https://www.instagram.com/p/CKWZAmFMXtn/',
    shortcode: 'CKWZAmFMXtn',
    thumbnail_url: null,
    timestamp: '2021-01-22T14:01:58+0000',
  },
];

const instaDataMissingFields = [
  {
    caption: null,
    comments_count: '11',
    id: '17855827526455551',
    like_count: '192',
    media_type: 'IMAGE',
    media_url: null,
    permalink: 'https://www.instagram.com/p/CKzks_DjnDh/',
    shortcode: 'CKzks_DjnDh',
    thumbnail_url: null,
    timestamp: '2021-02-02T22:02:00+0000',
  },
  {
    caption: null,
    comments_count: '4',
    id: '17886921169971782',
    like_count: '143',
    media_type: 'IMAGE',
    media_url:
      'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/144236968_2874527672759360_3132331619304084158_n.jpg?_nc_cat=109&ccb=2&_nc_sid=8ae9d6&_nc_ohc=P0k3mXw6kUcAX9OnMem&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=7e1a2f4437fbe5e8a70f02b6c6472945&oe=6042E3C6',
    permalink: 'https://www.instagram.com/p/CKq_WXYsNar/',
    shortcode: 'CKq_WXYsNar',
    thumbnail_url: null,
    timestamp: '2021-01-30T14:01:39+0000',
  },
];

const dataLength = instaData.length;

describe('Instagram grid', () => {
  test('Each image should render, check snapshot', () => {
    const { toJSON, queryByLabelText } = render(
      <InstagramFeed images={instaData} />
    );

    instaData.forEach((image) => {
      expect(queryByLabelText(image.caption)).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });

  test('Can press each image', () => {
    Linking.openURL = jest.fn();

    const { queryAllByRole } = render(<InstagramFeed images={instaData} />);

    expect(queryAllByRole('imagebutton').length).toEqual(dataLength);

    queryAllByRole('imagebutton').forEach((image) => {
      fireEvent.press(image);
    });

    expect(Linking.openURL).toHaveBeenCalledTimes(dataLength);
  });

  test('Image does not render on error', () => {
    const { queryByLabelText, queryAllByRole } = render(
      <InstagramFeed images={instaData} />
    );

    // all images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength);

    // trigger error
    act(() => {
      queryByLabelText(instaData[0].caption).props.onError();
    });

    // n-1 images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength - 1);

    // trigger second error

    act(() => {
      queryByLabelText(instaData[1].caption).props.onError();
    });

    // n-2 images render
    expect(queryAllByRole('imagebutton').length).toEqual(dataLength - 2);
  });

  test('Missing fields in data', () => {
    const { toJSON, queryAllByRole } = render(
      <InstagramFeed images={instaDataMissingFields} />
    );

    expect(
      queryAllByRole('imagebutton')[0].props.children.props.accessibilityLabel
    ).toBe('tap to view on Instagram');

    expect(
      queryAllByRole('imagebutton')[0].props.children.props.source
    ).toStrictEqual({
      uri: '',
    });

    expect(
      queryAllByRole('imagebutton')[1].props.children.props.accessibilityLabel
    ).toBe('tap to view on Instagram');

    expect(
      queryAllByRole('imagebutton')[1].props.children.props.source
    ).toStrictEqual({
      uri: instaDataMissingFields[1].media_url,
    });

    expect(toJSON()).toMatchSnapshot();
  });

  test('Maximum of 8 images render', () => {
    const combinedData = [...instaData, ...instaDataMissingFields];

    const { queryAllByRole } = render(<InstagramFeed images={combinedData} />);

    expect(combinedData.length).toBeGreaterThan(8);

    expect(queryAllByRole('imagebutton').length).toBe(8);
  });
});
