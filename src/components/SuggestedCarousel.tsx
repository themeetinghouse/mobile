import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../navigation/AppNavigator';
import SeriesService from '../services/SeriesService';
import GenericCarousel from './GenericCarousel';

export default function HighlightCarousel(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [suggestedVideos, setSuggestedVideos] = useState({
    items: [],
    loading: true,
    nextToken: '',
  });

  const getSuggestedVideos = async () => {
    const suggested = (await SeriesService.loadRandomPlaylist()) as any;
    setSuggestedVideos({ items: suggested, loading: false, nextToken: '' });
  };

  const handleNavigation = (item: any) => {
    navigation.push('SermonLandingScreen', {
      item: item?.video,
      customPlaylist: true,
      seriesId:
        item?.customPlaylist?.title ??
        item?.customPlaylist?.id ??
        item?.id.slice(12, item?.id?.length),
    });
  };

  useEffect(() => {
    getSuggestedVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <GenericCarousel
      handleNavigation={(item) => handleNavigation(item)}
      data={{
        items: suggestedVideos.items,
        loading: suggestedVideos.loading,
        nextToken: suggestedVideos.nextToken,
      }}
      header="Suggested Videos"
    />
  );
}
