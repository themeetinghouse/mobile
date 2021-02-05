import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetInstaPhotosQuery, GetInstaPhotosQueryVariables } from './API';
import { getInstaPhotos } from './queries';

function getInstaUsernameAndPageId(
  loc: string
): { username: string; pageId: string } {
  switch (loc) {
    case 'alliston':
      return {
        username: 'themeetinghousealliston',
        pageId: '17841400321603203',
      };
    case 'sandbanks':
      return { username: 'tmhsandbanks', pageId: '17841400321603203' };
    case 'ancaster':
      return { username: 'tmhancaster', pageId: '17841408879897536' };
    case 'brampton':
      return { username: 'tmhbrampton', pageId: '17841411750520408' };
    case 'brantford':
      return { username: 'tmhbrantford', pageId: '17841400321603203' };
    case 'burlington':
      return { username: 'tmhburlington', pageId: '17841408871557337' };
    case 'hamilton-downtown':
      return { username: 'tmhdowntownham', pageId: '17841400321603203' };
    case 'toronto-downtown':
      return { username: 'tmhdowntowntoronto', pageId: '17841408838131893' };
    case 'hamilton-mountain':
      return { username: 'tmhhammountain', pageId: '17841400321603203' };
    case 'toronto-east':
      return { username: 'tmheasttoronto', pageId: '17841409652026703' };
    case 'toronto-high-park':
      return { username: 'tmhhighpark', pageId: '17841432164905254' };
    case 'kitchener':
      return { username: 'tmhkitchener', pageId: '17841425888842969' };
    case 'london':
      return { username: 'themeetinghouseldn', pageId: '17841408115069699' };
    case 'newmarket':
      return { username: 'newmarket.tmh', pageId: '17841421476822902' };
    case 'oakville':
      return { username: 'tmhoakville', pageId: '17841400321603203' };
    case 'ottawa':
      return { username: 'tmhottawa', pageId: '17841408719847486' };
    case 'owen-sound':
      return { username: 'themeetinghouse', pageId: '17841400321603203' };
    case 'parry-sound':
      return { username: 'tmhparrysound', pageId: '17841443108276837' };
    case 'richmond-hill':
      return { username: 'tmhrichmond', pageId: '17841413912356153' };
    case 'toronto-uptown':
      return { username: 'tmhuptowntoronto', pageId: '17841409652056784' };
    case 'waterloo':
      return { username: 'tmhwaterloo', pageId: '17841417962985605' };
    default:
      return { username: 'themeetinghouse', pageId: '17841400321603203' };
  }
}

export type InstagramData = NonNullable<
  NonNullable<GetInstaPhotosQuery['getInstaPhotos']>['data']
>;

export default class InstagramService {
  static async getInstagramByLocation(
    loc: string
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
      const images = json.data?.getInstaPhotos?.data;

      if (images && images.length > 0) {
        return { images, username };
      }

      if (pageId !== '17841400321603203') {
        const fallbackQuery: GetInstaPhotosQueryVariables = {
          pageId: '17841400321603203',
        };
        const jsonFallback = (await API.graphql(
          graphqlOperation(getInstaPhotos, fallbackQuery)
        )) as GraphQLResult<GetInstaPhotosQuery>;
        const backupImages = jsonFallback.data?.getInstaPhotos?.data;
        if (backupImages) {
          return { images: backupImages, username: 'themeetinghouse' };
        }
      }
    } catch (e) {
      console.debug(e);
    }
    return { images: [], username: 'themeetinghouse' };
  }
}
