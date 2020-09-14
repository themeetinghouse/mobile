import { runGraphQLQuery } from './ApiService';
import { GetSeriesBySeriesTypeQuery, GetSeriesQuery } from './API';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';

type SeriesByTypeQueryResult = NonNullable<GetSeriesBySeriesTypeQuery['getSeriesBySeriesType']>;

export interface LoadSeriesListData {
  items: Array<NonNullable<SeriesByTypeQueryResult['items']>[0] | { loading: boolean }> | undefined;
  nextToken: SeriesByTypeQueryResult['nextToken'] | undefined;
}

type SeriesData = NonNullable<GetSeriesQuery['getSeries']>

interface SeriesDataWithHeroImage extends SeriesData {
  heroImage?: string;
}

export default class SeriesService {

  static loadSeriesList = async (limit: number, nextToken?: string): Promise<LoadSeriesListData> => {
    const queryResult = await API.graphql(graphqlOperation(getSeriesBySeriesType, { sortDirection: "DESC", limit: limit, seriesType: "adult-sunday", nextToken: nextToken })) as GraphQLResult<GetSeriesBySeriesTypeQuery>

    const items = queryResult?.data?.getSeriesBySeriesType?.items;
    if (items) {
      for (const item of items) {
        if (item) {
          SeriesService.updateSeriesImage(item as any);
        }
      }
    }
    return {
      items: items?.filter(item => item?.videos?.items && item?.videos?.items?.length > 0),
      nextToken: queryResult?.data?.getSeriesBySeriesType?.nextToken
    };
  }

  static loadSeriesById = async (seriesId: string): Promise<SeriesDataWithHeroImage> => {
    const queryResult = await runGraphQLQuery({
      query: getSeries,
      variables: { id: seriesId },
    });
    //console.log("SeriesService.loadSeriesById(): queryResult = ", queryResult);
    const series = queryResult.getSeries;
    SeriesService.updateSeriesImage(series);
    return series;
  }

  static updateSeriesImage = async (series: SeriesDataWithHeroImage): Promise<void> => {
    if (series.title) {
      series.image = `https://themeetinghouse.com/static/photos/series/adult-sunday-${series.title.replace("?", "")}.jpg`;
      series.heroImage = `https://www.themeetinghouse.com/static/photos/series/baby-hero/adult-sunday-${series.title.replace(/ /g, "%20")}.jpg`;
    } else {
      series.image = "https://www.themeetinghouse.com/static/NoCompassionLogo.png";
      series.heroImage = "https://www.themeetinghouse.com/static/NoCompassionLogo.png";
    }
  }
}

const getSeriesBySeriesType = `
  query getSeriesBySeriesType(
    $seriesType: String, 
    $startDate: ModelStringKeyConditionInput, 
    $sortDirection: ModelSortDirection, 
    $filter: ModelSeriesFilterInput, 
    $limit: Int, 
    $nextToken: String
  ) {
    getSeriesBySeriesType(seriesType: $seriesType, startDate: $startDate, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        seriesType
        title
        description
        image
        startDate
        endDate
        videos {
          items {
            id
            episodeTitle
            episodeNumber
            seriesTitle
            series {
              id
            }
            publishedDate
            description
            length
            YoutubeIdent
            videoTypes
            notesURL
            videoURL
            audioURL
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getSeries = `
  query GetSeries($id: ID!) {
    getSeries(id: $id) {
      id
      seriesType
      title
      description
      image
      startDate
      endDate
      videos {
        items {
          id
          episodeTitle
          episodeNumber
          seriesTitle
          series {
            id
          }
          publishedDate
          description
          length
          YoutubeIdent
          videoTypes
          notesURL
          videoURL
          audioURL
        }
        nextToken
      }
    }
  }
`;

/*const listSeriess = `query ListSeriess(
   $filter: ModelSeriesFilterInput
   $limit: Int
   $nextToken: String
 ) {
   listSeriess(filter: $filter, limit: $limit, nextToken: $nextToken) {
     items {
       id
       seriesType
       title
       description
       image
       startDate
       endDate
       videos {
         items {
           id
         }
         nextToken
       }
     }
     nextToken
   }
 }
 `;*/