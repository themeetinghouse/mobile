import { runGraphQLQuery } from './ApiService';

export default class SermonsService {

    static loadSermonsList = async (count = 20, nextToken = null) => {
      let queryResult = await runGraphQLQuery({ 
        query: getVideoByVideoType,
        variables: { sortDirection: "DESC", limit: count, videoTypes: "adult-sunday", publishedDate: { lt: "a" }, nextToken: nextToken },
      });
      return {
        items: queryResult.getVideoByVideoType.items, 
        nextToken: queryResult.getVideoByVideoType.nextToken
      };
    }

    static loadRecentSermonsList = async (count = 20, nextToken = null) => {
      return this.loadSermonsList(count, nextToken)
    }

    static loadSermonsInSeriesList = async (seriesTitle, count = 99999, nextToken = null) => {
      let query = { 
        query: getVideoByVideoType,
        variables: { sortDirection: "DESC", limit: count, videoTypes: "adult-sunday", publishedDate: { lt: "a" }, filter: { seriesTitle: { eq: seriesTitle } } },
      };
      let queryResult = await runGraphQLQuery(query);
      return {
        items: queryResult.getVideoByVideoType.items, 
        nextToken: queryResult.getVideoByVideoType.nextToken
      };
    }

    static loadHighlightsList = async (count = 20, nextToken = null) => {
      let query = { 
        query: getVideoByVideoType,
        variables: { sortDirection: "DESC", limit: count, videoTypes: "adult-sunday-shortcut", publishedDate: { lt: "a" }, nextToken: nextToken },
      };
      let queryResult = await runGraphQLQuery(query);

      return {
        items: queryResult.getVideoByVideoType.items, 
        nextToken: queryResult.getVideoByVideoType.nextToken
      };
    }




}

export const getVideoByVideoType = `query GetVideoByVideoType(
    $videoTypes: String
    $publishedDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVideoByVideoType(
      videoTypes: $videoTypes
      publishedDate: $publishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdBy
        createdDate
        episodeTitle
        originalEpisodeTitle
        episodeNumber
        seriesTitle
        publishedDate
        recordedDate
        description
        closedCaptioning
        referencedMedia
        campaigns
        bibleVerses
        topics
        qandeh
        length
        YoutubeIdent
        Youtube {
            id
            kind
            etag
            snippet {
                publishedAt
                channelId
                title
                description
                thumbnails {
                default {
                    url
                    width
                    height
                }
                medium {
                    url
                    width
                    height
                }
                high {
                    url
                    width
                    height
                }
                standard {
                    url
                    width
                    height
                }
                maxres {
                    url
                    width
                    height
                }
                }
                channelTitle
                localized {
                title
                description
                }
            }
            contentDetails {
                videoId
                videoPublishedAt
                duration
                dimension
                definition
                caption
                licensedContent
                projection
            }
            status {
                uploadStatus
                privacyStatus
                license
                embeddable
                publicStatsViewable
            }
        }
        videoTypes
        notesURL
        videoURL
        audioURL
        speakers {
          items {
            id
            speaker {
              id
              name
              image
              videos {
                items {
                  id
                }
                nextToken
              }
            }
          }
          nextToken
        }
        series {
          id
          seriesType
          title
          description
          image
          startDate
          endDate
        }
      }
      nextToken
    }
  }
  `;



//   const allSermons = [
//     {
//         id: "1",
//         title: "Q & eh?",
//         episode: 5,
//         series: "Origins",
//         date: "2019-12-27",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
//     {
//         id: "2",
//         title: "Q & eh? 2",
//         episode: 5,
//         series: "Origins",
//         date: "2020-01-09",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
//     {
//         id: "3",
//         title: "Q & eh? 3",
//         episode: 5,
//         series: "Origins",
//         date: "2020-01-16",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
//     {
//         id: "4",
//         title: "Q & eh? 3",
//         episode: 5,
//         series: "Origins",
//         date: "2020-01-16",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
//     {
//         id: "5",
//         title: "Q & eh? 3",
//         episode: 5,
//         series: "Origins",
//         date: "2020-01-16",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
//     {
//         id: "6",
//         title: "Q & eh? 3",
//         episode: 5,
//         series: "Origins",
//         date: "2020-01-16",
//         thumbnail: "https://i.ytimg.com/vi/07jUBhJicCo/hqdefault.jpg",
//     },
// ]

