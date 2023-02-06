/* eslint-disable eqeqeq */
import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import LocationsService from './LocationsService';
import {
  HomeChurchInfo,
  ListF1ListGroup2sQuery,
  ListHomeChurchInfosQuery,
} from './API';
import { listF1ListGroup2s, listHomeChurchInfos } from './queries';

export type ListF1ListGroup2sData = NonNullable<
  NonNullable<ListF1ListGroup2sQuery['listF1ListGroup2s']>['items']
>[0];

export type F1HomeChurchInfoWithLocation = ListF1ListGroup2sData & {
  homeChurchInfoData: HomeChurchInfo & { siteName: string };
};

export default class HomeChurchService {
  static async loadHomeChurchF1Data(): Promise<Array<ListF1ListGroup2sData>> {
    const data: Array<ListF1ListGroup2sData> = [];
    const fetchNext = async (next: string | null = null) => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 200,
            nextToken: next,
          },
        })) as GraphQLResult<ListF1ListGroup2sQuery>;
        if (json?.data?.listF1ListGroup2s?.items?.length) {
          json?.data?.listF1ListGroup2s?.items?.forEach((f1Info) => {
            if (f1Info) data.push(f1Info);
          });
        }
        if (json?.data?.listF1ListGroup2s?.nextToken) {
          await fetchNext(json?.data?.listF1ListGroup2s?.nextToken);
        }
      } catch (err) {
        console.error({ err });
      }
    };
    await fetchNext();
    return data;
  }

  static async loadHomeChurchData(): Promise<Array<HomeChurchInfo>> {
    const data: Array<HomeChurchInfo> = [];
    const fetchNext = async (next: string | null = null) => {
      try {
        const json = (await API.graphql({
          query: listHomeChurchInfos,
          variables: {
            limit: 200,
            nextToken: next,
          },
        })) as GraphQLResult<ListHomeChurchInfosQuery>;
        if (json?.data?.listHomeChurchInfos?.items?.length) {
          json?.data?.listHomeChurchInfos?.items?.forEach((hmInfo) => {
            if (hmInfo) data.push(hmInfo);
          });
        }
        if (json?.data?.listHomeChurchInfos?.nextToken)
          await fetchNext(json?.data?.listHomeChurchInfos?.nextToken);
      } catch (err) {
        console.error({ err });
      }
    };
    await fetchNext();
    return data;
  }

  static async injectHomeChurchInfoData(
    f1HomeChurches: Array<ListF1ListGroup2sData>,
    homeChurchInfoData: Array<HomeChurchInfo>
  ): Promise<F1HomeChurchInfoWithLocation[]> {
    const locations = await LocationsService.loadLocations();
    return f1HomeChurches.map((f1HomeChurch) => {
      const inHomeChurchInfosTable = homeChurchInfoData.find(
        (homeChurchInfo) => homeChurchInfo?.id === f1HomeChurch?.id
      );
      const locationName =
        locations.find(
          (location) =>
            location?.homeChurchGroupID == f1HomeChurch?.groupType?.id
        )?.name ?? '';
      return {
        ...f1HomeChurch,
        homeChurchInfoData: {
          ...inHomeChurchInfosTable,
          siteName: locationName,
        },
      };
    }) as F1HomeChurchInfoWithLocation[];
  }

  static async loadDataForHomeChurchScreen(): Promise<
    F1HomeChurchInfoWithLocation[]
  > {
    const homeChurchData = await HomeChurchService.loadHomeChurchData();
    const homeChurchF1Data = await HomeChurchService.loadHomeChurchF1Data();
    return HomeChurchService.injectHomeChurchInfoData(
      homeChurchF1Data,
      homeChurchData
    );
  }
}
