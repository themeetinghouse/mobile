import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import {
  GetInstaPhotosQuery,
  GetInstaPhotosQueryVariables,
  TMHLocation,
} from './API';
import { getInstaPhotos } from './queries';

function getInstaUsernameAndPageId(location: TMHLocation | null | undefined): {
  username: string;
  pageId: string;
} {
  const instaData = {
    username: 'themeetinghouse',
    pageId: '17841400321603203',
  };
  if (!location) return instaData;
  const insta = location.socials?.instagram?.[0];
  if (insta && insta.pageId && insta.username) {
    instaData.pageId = insta.pageId;
    instaData.username = insta.username;
  }

  return instaData;
}

export type InstagramData = NonNullable<
  NonNullable<GetInstaPhotosQuery['getInstaPhotos']>['data']
>;

export default class InstagramService {
  static async getInstagramByLocation(
    loc: TMHLocation | null | undefined
  ): Promise<{ images: InstagramData; username: string }> {
    const { username, pageId } = getInstaUsernameAndPageId(loc);

    try {
      const data = await InstagramService.getInstagram(username, pageId);
      return data;
    } catch (e) {
      console.error(e);
    }

    return { images: [], username: 'themeetinghouse' };
  }

  static async getInstagram(
    username: string,
    pageId: string
  ): Promise<{ images: InstagramData; username: string }> {
    try {
      const query: GetInstaPhotosQueryVariables = {
        pageId,
      };
      const json = (await API.graphql(
        graphqlOperation(getInstaPhotos, query)
      )) as GraphQLResult<GetInstaPhotosQuery>;
      if (!json.data?.getInstaPhotos?.data?.length) {
        if (pageId !== '17841400321603203') {
          const fallbackQuery: GetInstaPhotosQueryVariables = {
            pageId: '17841400321603203',
          };
          const jsonFallback = (await API.graphql(
            graphqlOperation(getInstaPhotos, fallbackQuery)
          )) as GraphQLResult<GetInstaPhotosQuery>;
          const oakvilleImages = jsonFallback.data?.getInstaPhotos?.data;
          if (oakvilleImages) {
            return { images: oakvilleImages, username: 'themeetinghouse' };
          }
        }
      } else {
        const { data } = json.data.getInstaPhotos;
        const { length } = data;
        const images = [];
        let i = 0;

        while (i < length && images.length < 8) {
          if (data[i]?.media_type !== 'VIDEO') images.push(data[i]);
          i += 1;
        }
        return { images, username };
      }
    } catch (e) {
      console.debug(e);
    }
    return { images: [], username: 'themeetinghouse' };
  }
}
