import React, { useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { Livestream } from '../services/API';
import { Style, HeaderStyle } from '../Theme.style';
import NotesScreen from './teaching/NotesScreen';
import { MainStackParamList } from '../navigation/AppNavigator';
import useTeaching from '../hooks/useTeaching';

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
  livestream: Livestream;
  navigation: StackNavigationProp<MainStackParamList, 'NotesScreen'>;
  route: RouteProp<MainStackParamList, 'NotesScreen'>;
}

export default function LiveStreamScreen({
  livestream,
  navigation,
  route,
}: Props): JSX.Element {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const deviceWidth = Dimensions.get('window').width;
  const handleVideoReady = () => {
    playerRef?.current?.seekTo(0, true);
  };
  const { teaching } = useTeaching(false);
  return (
    <View style={{ backgroundColor: 'black' }}>
      <View style={style.player}>
        <YoutubePlayer
          volume={100}
          ref={playerRef}
          onReady={handleVideoReady}
          forceAndroidAutoplay
          height={Math.round(deviceWidth * (9 / 16))}
          width={Math.round(deviceWidth)}
          videoId={livestream?.liveYoutubeId ?? ''}
          play
          initialPlayerParams={{ modestbranding: true }}
        />
      </View>
      <NotesScreen
        fromLiveStream
        today={teaching?.publishedDate ?? ''}
        navigation={navigation}
        route={route}
      />
    </View>
  );
}
