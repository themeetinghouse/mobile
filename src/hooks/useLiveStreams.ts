import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Livestream } from '../../src/services/API';
import LiveEventService from '../../src/services/LiveEventService';

export const getInLocalTime = (
  dateInEst: string | undefined | null,
  timeInEST: string | undefined | null
) => {
  const dateTimeInEST = moment.tz(
    `${dateInEst} ${timeInEST}`,
    'YYYY-MM-DD HH:mm',
    'America/Toronto'
  );
  return dateTimeInEST.local();
};
const isEventLive = (livestream: Livestream) => {
  const currentTime = moment();
  const eventStartTime = getInLocalTime(
    livestream.date,
    livestream.videoStartTime
  );
  const eventEndTime = getInLocalTime(livestream.date, livestream.endTime);
  const isLive = currentTime.isBetween(eventStartTime, eventEndTime);
  return isLive;
};

const isEventUpcoming = (livestream: Livestream) => {
  const currentTime = moment();
  const eventStartTime = getInLocalTime(livestream.date, livestream.startTime);
  const eventEndTime = getInLocalTime(livestream.date, livestream.endTime);
  const isUpcoming = currentTime.isBetween(eventStartTime, eventEndTime);
  return isUpcoming;
};

const isEventInFuture = (livestream: Livestream) => {
  const currentTime = moment();
  const eventEndTime = getInLocalTime(livestream.date, livestream.endTime);
  return currentTime.isBefore(eventEndTime);
};

export default function useLiveStreams() {
  const navigation = useNavigation();
  const [liveStreams, setLiveStreams] = useState<Livestream[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isPreLive, setIsPreLive] = useState(false);
  const [isLiveStreamsLoaded, setIsLiveStreamsLoaded] = useState(false);
  const [currentLiveEvents, setCurrentLiveEvents] = useState<Livestream[]>([]);
  const [currentUpcomingEvents, setCurrentUpcomingEvents] = useState<
    Livestream[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Livestream[]>([]);
  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        setIsLiveStreamsLoaded(false);
        const liveStreamsResult = await LiveEventService.fetchLiveEventData();
        if (liveStreamsResult) {
          setLiveStreams(liveStreamsResult);
          const futureEvents = liveStreamsResult.filter(isEventInFuture);
          setUpcomingEvents(futureEvents);
          const eventsThatAreLive = liveStreamsResult.filter(isEventLive);
          setCurrentLiveEvents(eventsThatAreLive);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLiveStreamsLoaded(true);
      }
    };
    loadLiveStreams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const eventsThatAreLive = liveStreams.filter(isEventLive);
      const futureEvents = liveStreams.filter(isEventInFuture);
      const currentUpcomingEvents = liveStreams.filter(isEventUpcoming);
      setCurrentUpcomingEvents(currentUpcomingEvents);
      setCurrentLiveEvents(eventsThatAreLive);
      setUpcomingEvents(futureEvents);
      setIsLive(eventsThatAreLive.length > 0);
      setIsPreLive(currentUpcomingEvents.length > 0);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [liveStreams, navigation, isLiveStreamsLoaded, upcomingEvents]);
  return {
    currentUpcomingEvents,
    liveStreams,
    isLiveStreamsLoaded,
    isLive,
    isPreLive,
    currentLiveEvents,
    upcomingEvents,
  };
}
