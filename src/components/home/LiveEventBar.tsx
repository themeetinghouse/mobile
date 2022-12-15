import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainStackParamList } from '../../navigation/AppNavigator';
import useLiveStreams from '../../hooks/useLiveStreams';
import AnnouncementBar from './AnnouncementBar';

export default function LiveEvents(): JSX.Element | null {
  const { currentLiveEvents, isPreLive, isLive } = useLiveStreams();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  let message = '';
  if (isPreLive) message = 'Live';
  if (isLive) message = currentLiveEvents?.[0]?.homepageLink || 'Live';

  return isPreLive || isLive ? (
    <AnnouncementBar
      onPress={() => navigation.navigate('LiveStreamsScreen')}
      message={message}
    />
  ) : null;
}
