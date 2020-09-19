import { GetInstagramByLocationQuery, GetInstagramByLocationQueryVariables, ModelSortDirection } from './API'
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

const locationsToUsername: { [loc: string]: string } = {
  "alliston": "themeetinghousealliston",
  "sandbanks": "tmhsandbanks",
  "ancaster": "tmhancaster",
  "brampton": "tmhbrampton",
  "brantford": "tmhbrantford",
  "burlington": "tmhburlington",
  "hamilton-downtown": "tmhdowntownham",
  "toronto-downtown": "tmhdowntowntoronto",
  "hamilton-mountain": "tmhhammountain",
  "toronto-east": "tmheasttoronto",
  "toronto-high-park": "tmhhighpark",
  "kitchener": "tmhkitchener",
  "london": "themeetinghouseldn",
  "newmarket": "newmarket.tmh",
  "oakville": "tmhoakville",
  "ottawa": "tmhottawa",
  "owen-sound": "themeetinghouse",
  "parry-sound": "themeetinghouse",
  "richmond-hill": "tmhrichmond",
  "toronto-uptown": "tmhuptowntoronto",
  "waterloo": "tmhwaterloo",
  "unknown": "themeetinghouse"
}

export type InstagramData = NonNullable<GetInstagramByLocationQuery['getInstagramByLocation']>['items']

export default class InstagramService {

  static async getInstagramByLocation(loc: string): Promise<{ images: InstagramData, username: string }> {
    const username = InstagramService.mapLocationToInstagram(loc);

    if (username) {
      const data = await InstagramService.getInstagram(username);
      return data;
    } else {
      return { images: [], username: '' }
    }
  }

  static mapLocationToInstagram(loc: string): string | undefined {
    return locationsToUsername[loc];
  }

  static async getInstagram(username: string): Promise<{ images: InstagramData, username: string }> {

    try {
      const query: GetInstagramByLocationQueryVariables = { locationId: username, limit: 8, sortDirection: ModelSortDirection.DESC }
      const json = await API.graphql(graphqlOperation(getInstagramByLocation, query)) as GraphQLResult<GetInstagramByLocationQuery>
      const images = json.data?.getInstagramByLocation?.items;

      if (images && images.length > 0) {
        return { images, username }
      }

      else if (username !== 'themeetinghouse') {
        const query2: GetInstagramByLocationQueryVariables = { locationId: 'themeetinghouse', limit: 8, sortDirection: ModelSortDirection.DESC }
        const json2 = await API.graphql(graphqlOperation(getInstagramByLocation, query2)) as GraphQLResult<GetInstagramByLocationQuery>
        const backupImages = json2.data?.getInstagramByLocation?.items;
        if (backupImages) {
          return { images: backupImages, username: 'themeetinghouse' }
        }
      }

    } catch (e) {
      console.debug(e)
    }
    return { images: [], username: '' }
  }
}

export const getInstagramByLocation = /* GraphQL */ `
  query GetInstagramByLocation(
    $locationId: String
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInstagramFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getInstagramByLocation(
      locationId: $locationId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        locationId
        thumbnails {
          src
          config_width
          config_height
        }
        altText
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;