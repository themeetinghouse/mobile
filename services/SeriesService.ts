import { runGraphQLQuery } from './ApiService';
import { GetSeriesBySeriesTypeQuery, GetSeriesQuery } from './API';

type SeriesByTypeQueryResult = NonNullable<GetSeriesBySeriesTypeQuery['getSeriesBySeriesType']>;

export interface LoadSeriesListData {
  items: Array<NonNullable<SeriesByTypeQueryResult['items']>[0] | { loading: boolean }>;
  nextToken: SeriesByTypeQueryResult['nextToken'];
}

type SeriesData = NonNullable<GetSeriesQuery['getSeries']>

interface SeriesDataWithHeroImage extends SeriesData {
  heroImage?: string;
}

export default class SeriesService {

    static loadSeriesList = async (limit: number, nextToken?: string): Promise<LoadSeriesListData> => {
      const queryResult = await runGraphQLQuery({ 
        query: getSeriesBySeriesType,
        variables: { sortDirection: "DESC", limit: limit, seriesType: "adult-sunday", nextToken: nextToken },
      });
      console.log("SeriesService.loadSeriesList(): loaded.  nextToken = ", queryResult.getSeriesBySeriesType.nextToken);
      const items = queryResult.getSeriesBySeriesType.items;
      for (const item of items) {
        SeriesService.updateSeriesImage(item);
      }
      return {
        items: items,
        nextToken: queryResult.getSeriesBySeriesType.nextToken
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
      if (series.title){
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