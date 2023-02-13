import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { Style, HeaderStyle } from '../Theme.style';
import NotesScreen from './teaching/NotesScreen';
import { MainStackParamList } from '../navigation/AppNavigator';
import useTeaching from '../hooks/useTeaching';
import { useModalContext } from '../contexts/ModalContext/ModalContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: 'red',
      padding: 0,
    },
  },
  player: {
    height: Math.round(Dimensions.get('window').width * (9 / 16)),
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  title: {
    ...Style.title,
    ...{
      padding: 16,
    },
  },
  body: {
    ...Style.body,
    ...{},
  },
});

interface Props {
  navigation: StackNavigationProp<MainStackParamList, 'LiveStreamScreen'>;
  route: RouteProp<MainStackParamList, 'LiveStreamScreen'>;
}

export default function LiveStreamScreen({
  navigation,
  route,
}: Props): JSX.Element | null {
  const liveStreamData = route?.params?.livestream;
  const { newModal, dismissModal } = useModalContext();
  const playerRef = useRef<YoutubeIframeRef>(null);
  const deviceWidth = Dimensions.get('window').width;
  const handleVideoReady = () => {
    playerRef?.current?.seekTo(0, true);
  };
  const { teaching } = useTeaching(false);
  useEffect(() => {
    if (!liveStreamData?.liveYoutubeId)
      newModal({
        title: 'Live Stream Not Found',
        body: 'The live stream you are looking for is not available.',
        actionLabel: 'OK',
        isVisible: true,
        action: () => {
          dismissModal?.();
          navigation.goBack();
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStreamData]);
  if (!liveStreamData?.liveYoutubeId) return null;
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={style.player}>
        <YoutubePlayer
          volume={100}
          ref={playerRef}
          onReady={handleVideoReady}
          forceAndroidAutoplay
          height={Math.round(deviceWidth * (9 / 16))}
          width={Math.round(deviceWidth)}
          videoId={liveStreamData?.liveYoutubeId}
          play
          initialPlayerParams={{ modestbranding: true }}
        />
      </View>
      <NotesScreen fromLiveStream today={teaching?.publishedDate ?? ''} />
    </View>
  );
}
