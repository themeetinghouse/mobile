import { runGraphQLQuery } from './ApiService';
import { ListSpeakersQuery } from './API';

export type loadSpeakersListData = {
  items: NonNullable<ListSpeakersQuery['listSpeakers']>['items'];
  nextToken: NonNullable<ListSpeakersQuery['listSpeakers']>['nextToken']
}

export default class SpeakersService {

  static loadSpeakersList = async (limit = 9999, nextToken = null): Promise<loadSpeakersListData> => {
    const queryResult = await runGraphQLQuery({
      query: listSpeakersQuery,
      variables: { limit: limit, nextToken: nextToken },
    })

    queryResult.listSpeakers.items.sort((a: any, b: any) => {
      if (a.videos.items.length > b.videos.items.length) {
        return -1;
      } else if (a.videos.items.length < b.videos.items.length) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    return {
      items: queryResult.listSpeakers.items.filter((a: any) => a.videos.items.length !== 0),
      nextToken: queryResult.listSpeakers.nextToken
    };
  }
  static loadSpeakersListOnly = async (limit = 9999, nextToken = null): Promise<loadSpeakersListData> => {
    const queryResult = await runGraphQLQuery({
      query: listSpeakersNoVideos,
      variables: { limit: limit, nextToken: nextToken },
    })
    return {
      items: queryResult.listSpeakers.items.sort((a: any, b: any) => a.name.localeCompare(b.name)),
      nextToken: queryResult.listSpeakers.nextToken
    };
  }
}

export const listSpeakersNoVideos = `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        hidden
        image
      }
      nextToken
    }
  }
  `;

export const listSpeakersQuery = `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        hidden
        image
        videos (limit:1000){
          items {
            id
            video{
              publishedDate
              description
              audioURL
              YoutubeIdent
              id
              episodeTitle
              episodeNumber
              seriesTitle
              Youtube{
                snippet {
                  thumbnails {
                    default {
                      url
                    }
                    medium {
                      url
                    }
                    high {
                      url
                    }
                    standard {
                      url
                    }
                    maxres {
                      url
                    }
                  }
                }
                contentDetails{
                  videoId
                }
              }
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
  `;