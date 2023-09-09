import React, { useEffect, useState } from 'react';
import { GraphQLResult, GRAPHQL_AUTH_MODE, API } from '@aws-amplify/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../../../navigation/AppNavigator';
import { popularTeachingQuery } from '../../../graphql/queries';
import GenericCarousel from '../../GenericCarousel';
import { CustomPlaylistType } from '../ContentTypes';
import { GetVideoByVideoTypeQuery } from '../../../services/API';

export default function CustomPlaylistCarousel({
  item,
}: {
  item: CustomPlaylistType;
}) {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { header, subclass, subheader, sortOrder } = item;
  const [videos, setVideos] = useState<
    NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']
  >([]);
  const [nextToken, setNextToken] =
    useState<
      NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['nextToken']
    >(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const variables = {
          nextToken,
          sortDirection: sortOrder ?? 'DESC',
          limit: 50,
          videoTypes: subclass,
          publishedDate: { lt: 'a' },
        };

        const getVideoByVideoType = (await API.graphql({
          query: popularTeachingQuery,
          variables,
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        })) as GraphQLResult<GetVideoByVideoTypeQuery>;
        setVideos(getVideoByVideoType?.data?.getVideoByVideoType?.items ?? []);
        setNextToken(getVideoByVideoType?.data?.getVideoByVideoType?.nextToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (subclass) loadVideos();
  }, [subheader, subclass, nextToken, sortOrder]);
  const handleNavigation = (item2: any) => {
    navigation.push('SermonLandingScreen', {
      item: item2,
      seriesId:
        item2?.customPlaylist?.title ??
        item2?.customPlaylist?.id ??
        item2?.id.slice(12, item2?.id?.length),
    });
  };
  return (
    <GenericCarousel
      header={header}
      subHeader={subheader}
      data={{
        items: videos,
        loading: isLoading,
        nextToken: '',
      }}
      handleNavigation={(item2) => handleNavigation(item2)}
    />
  );
}
