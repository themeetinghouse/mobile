import { runGraphQLQuery } from './ApiService';
import { ListSpeakersQuery } from './API';
import StaffDirectoryService from './StaffDirectoryService';
import { listSpeakersNoVideos, listSpeakersQuery } from './queries';

export type loadSpeakersListData = {
  items: NonNullable<ListSpeakersQuery['listSpeakers']>['items'];
  nextToken: NonNullable<ListSpeakersQuery['listSpeakers']>['nextToken'];
};

export default class SpeakersService {
  static loadSpeakersList = async (
    limit = 9999,
    nextToken = null
  ): Promise<loadSpeakersListData> => {
    const queryResult = await runGraphQLQuery({
      query: listSpeakersQuery,
      variables: { limit, nextToken },
    });

    queryResult.listSpeakers.items.sort((a: any, b: any) => {
      if (a.videos.items.length > b.videos.items.length) {
        return -1;
      }
      if (a.videos.items.length < b.videos.items.length) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
    const staff: any = await StaffDirectoryService.loadStaffJson();
    queryResult.listSpeakers.items.map((speaker: any, index: number) => {
      for (let x = 0; x < staff.length; x++) {
        if (`${staff[x].FirstName} ${staff[x].LastName}` === speaker.name) {
          queryResult.listSpeakers.items[index].Phone = staff[x].Phone;
          queryResult.listSpeakers.items[index].Email = staff[x].Email;
          queryResult.listSpeakers.items[index].Position = staff[x]?.Position;
        }
      }
    });
    return {
      items: queryResult.listSpeakers.items.filter(
        (a: any) => a.videos.items.length !== 0
      ),
      nextToken: queryResult.listSpeakers.nextToken,
    };
  };

  static loadSpeakersListOnly = async (
    limit = 9999,
    nextToken = null
  ): Promise<loadSpeakersListData> => {
    const queryResult = await runGraphQLQuery({
      query: listSpeakersNoVideos,
      variables: { limit, nextToken },
    });
    const staff = await StaffDirectoryService.loadStaffJson();
    queryResult.listSpeakers.items.forEach((speaker: any, index: number) => {
      for (let x = 0; x < staff.length; x++) {
        if (`${staff[x].FirstName} ${staff[x].LastName}` === speaker.name) {
          queryResult.listSpeakers.items[index].Phone = staff[x].Phone;
          queryResult.listSpeakers.items[index].Email = staff[x].Email;
          queryResult.listSpeakers.items[index].Position = staff[x]?.Position;
        }
      }
    });
    return {
      items: queryResult.listSpeakers.items.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      ),
      nextToken: queryResult.listSpeakers.nextToken,
    };
  };
}
