import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { Style, HeaderStyle } from '../Theme.style';

import NotesScreen from './teaching/NotesScreen';
import { MainStackParamList } from '../navigation/AppNavigator';
import LiveEventService from '../services/LiveEventService';

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
  navigation: StackNavigationProp<MainStackParamList, 'NotesScreen'>;
  route: RouteProp<MainStackParamList, 'NotesScreen'>;
}

type LiveEvent = {
  id: string | null;
  date: string | null;
  startTime: string | null;
  videoStartTime: string | null;
  endTime: string | null;
  prerollYoutubeId: string | null;
  liveYoutubeId: string | null;
} | null;

export default function LiveStreamScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const [currentEvent, setCurrentEvent] = useState<LiveEvent>(null);
  const [showTime, setShowTime] = useState<boolean>(false);
  const playerRef = useRef<YoutubeIframeRef>(null);
  const deviceWidth = Dimensions.get('window').width;
  const today = moment()
    .utcOffset(moment().isDST() ? '-0400' : '-0500')
    .format('YYYY-MM-DD');
  const handleVideoReady = () => {
    playerRef?.current?.seekTo(0, true);
  };

  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        const liveStreamsResult =
          await LiveEventService.startLiveEventService();
        liveStreamsResult.liveEvents.forEach((event: LiveEvent) => {
          const rightNow = moment()
            .utcOffset(moment().isDST() ? '-0400' : '-0500')
            .format('HH:mm');
          const isShowTime =
            event?.startTime &&
            event?.endTime &&
            rightNow >= event.startTime &&
            rightNow <= event.endTime;
          if (isShowTime) {
            setCurrentEvent(event);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadLiveStreams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const start = currentEvent?.videoStartTime;
      const end = currentEvent?.endTime;
      const rightNow = moment()
        .utcOffset(moment().isDST() ? '-0400' : '-0500')
        .format('HH:mm');

      if (start && end) {
        const isShowTime = rightNow >= start && rightNow <= end;
        if (isShowTime) {
          setShowTime(true);
        }
      } else {
        setShowTime(false);
      }
      if (
        currentEvent?.videoStartTime &&
        rightNow >= currentEvent?.videoStartTime
      ) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEvent]);

  // this page needs to be unmounted when navigating to teaching
  return (
    <View style={{ backgroundColor: 'black' }}>
      <View style={style.player}>
        {showTime ? (
          <YoutubePlayer
            volume={100}
            ref={playerRef}
            onReady={handleVideoReady}
            forceAndroidAutoplay
            height={Math.round(deviceWidth * (9 / 16))}
            width={Math.round(deviceWidth)}
            videoId={currentEvent ? (currentEvent.liveYoutubeId as string) : ''}
            play
            initialPlayerParams={{ modestbranding: true }}
          />
        ) : (
          <YoutubePlayer
            volume={100}
            ref={playerRef}
            onReady={handleVideoReady}
            forceAndroidAutoplay
            height={Math.round(deviceWidth * (9 / 16))}
            width={Math.round(deviceWidth)}
            videoId={
              currentEvent ? (currentEvent.prerollYoutubeId as string) : ''
            }
            play
            initialPlayerParams={{ modestbranding: true }}
          />
        )}
      </View>
      <NotesScreen
        fromLiveStream
        today={today}
        navigation={navigation}
        route={route}
      />
    </View>
  );
}
