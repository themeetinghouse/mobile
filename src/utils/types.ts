import { GetVideoByVideoTypeQuery } from '../services/API';

export type VideoData = NonNullable<
  NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']
>[0];
