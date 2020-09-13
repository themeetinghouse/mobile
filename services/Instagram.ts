import { GetInstagramByLocationQuery } from './API'
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

export type LocationKey = "alliston"
    | "sandbanks"
    | "ancaster"
    | "brampton"
    | "brantford"
    | "burlington"
    | "hamilton-downtown"
    | "toronto-downtown"
    | "hamilton-mountain"
    | "toronto-east"
    | "toronto-high-park"
    | "kitchener"
    | "london"
    | "newmarket"
    | "oakville"
    | "ottawa"
    | "owen-sound"
    | "parry-sound"
    | "richmond-hill"
    | "toronto-uptown"
    | "waterloo"

const locationsToUsername = {
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

    static async getInstagramByLocation(loc: LocationKey): Promise<{ images: InstagramData, username: string }> {
        const username = InstagramService.mapLocationToInstagram(loc);
        const data = await InstagramService.getInstagram(username);
        return data;
    }

    static mapLocationToInstagram(loc: LocationKey): string {
        return locationsToUsername[loc];
    }

    static async getInstagram(username: string): Promise<{ images: InstagramData, username: string }> {

        try {
            const json = await API.graphql(graphqlOperation(getInstagramByLocation, { locationId: username, limit: 8 })) as GraphQLResult<GetInstagramByLocationQuery>
            const images = json.data?.getInstagramByLocation?.items;

            if (images && images.length > 0) {
                return { images, username }

            }

            else if (username !== 'themeetinghouse') {
                const json2 = await API.graphql(graphqlOperation(getInstagramByLocation, { locationId: 'themeetinghouse', limit: 8 })) as GraphQLResult<GetInstagramByLocationQuery>
                const backupImages = json2.data?.getInstagramByLocation?.items;
                if (backupImages) {
                    return { images: backupImages, username: 'themeetinghouse' }
                }
            }

        } catch (e) {
            console.error(e)
        }
        return { images: [], username: '' }
    }
}

export const getInstagramByLocation = /* GraphQL */ `
  query GetInstagramByLocation(
    $locationId: String
    $sortDirection: ModelSortDirection
    $filter: ModelInstagramFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getInstagramByLocation(
      locationId: $locationId
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;