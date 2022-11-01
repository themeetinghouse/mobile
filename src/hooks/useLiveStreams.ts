import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import LiveEventService from '../../src/services/LiveEventService';

export default function useLiveStreams(reload: boolean) {
  const [liveStreams, setLiveStreams] = useState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        setIsLoaded(false);
        const liveStreamsResult =
          await LiveEventService.startLiveEventService();
        if (liveStreamsResult?.liveEvents)
          setLiveStreams(liveStreamsResult?.liveEvents);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLiveStreams();
  }, [reload]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [preLive, setPreLive] = useState(false);
  const [live, setLive] = useState(false);
  const handleAppStateChange = (nextAppState: any) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appStateVisible === 'active' && liveStreams && liveStreams.length > 0) {
      interval = setInterval(() => {
        if (!navigation.isFocused()) {
          clearInterval(interval); // clears interval on navigate away
          return;
        }
        const rightNow = moment()
          .utcOffset(moment().isDST() ? '-0400' : '-0500')
          .format('HH:mm');
        const current = liveStreams.filter((event: any) => {
          return (
            event?.startTime &&
            event?.endTime &&
            rightNow >= event.startTime &&
            rightNow <= event.endTime
          );
        })[0];
        if (current?.id.includes('After Party')) {
          /* More logic is required to include After Party message in banner */
          clearInterval(interval);
          setLive(false);
          setPreLive(false);
          return;
        }
        if (current && rightNow <= current.endTime) {
          if (
            rightNow >= current.startTime &&
            rightNow < current.videoStartTime
          ) {
            setPreLive(true);
          } else {
            setPreLive(false);
          }
          const start = current?.videoStartTime;
          const end = current?.endTime;
          const showTime = rightNow >= start && rightNow <= end;
          if (showTime) {
            if (preLive) setPreLive(false);
            setLive(true);
          }
        } else {
          setLive(false);
          setPreLive(false);
          if (rightNow > liveStreams[liveStreams.length - 1]?.endTime) {
            // Ends for the day
            clearInterval(interval);
          }
        }
      }, 2000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStateVisible, liveStreams, preLive]);
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      appStateListener.remove();
    };
  }, [reload]);
  return { liveStreams, liveStreamsLoaded: isLoaded, live, preLive };
}
