import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Button,
  Thumbnail,
  Left,
  Right,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import { StyleSheet, AppState } from 'react-native';
import * as Linking from 'expo-linking';
import { CompositeNavigationProp } from '@react-navigation/native';
import { API, GraphQLResult, graphqlOperation } from '@aws-amplify/api';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import AnnouncementCard from "../../components/home/AnnouncementCard";
import AnnouncementService, { Announcement } from "../../services/AnnouncementService";
import EventCard from '../../components/home/EventCard';
import RecentTeaching from '../../components/home/RecentTeaching';
import EventsService from '../../services/EventsService';
import ActivityIndicator from '../../components/ActivityIndicator';
import LocationContext from '../../contexts/LocationContext';
import { Location } from '../../services/LocationsService';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import WhiteButton from '../../components/buttons/WhiteButton';
import InstagramService, { InstagramData } from '../../services/Instagram';
import InstagramFeed from '../../components/home/InstagramFeed';
import AllButton from '../../components/buttons/AllButton';
import AnnouncementBar from '../../components/home/AnnouncementBar';
import LiveEventService from '../../services/LiveEventService';
import UserContext from '../../contexts/UserContext';
import { MainStackParamList } from '../../navigation/AppNavigator';
import Header from '../../components/Header';
import {
  GetNotesQuery,
  GetVideoByVideoTypeQueryVariables,
  ModelSortDirection,
  GetVideoByVideoTypeQuery,
} from '../../services/API';
import { VideoData } from '../../utils/types';
import NotesService from '../../services/NotesService';
import { getVideoByVideoType } from '../../graphql/queries';

const style = StyleSheet.create({
  categoryContainer: {
    backgroundColor: Theme.colors.black,
    paddingTop: 32,
  },
  categoryTitle: Style.categoryTitle,
  headerTitle: HeaderStyle.title,
  icon: Style.icon,
  headerButton: {
    backgroundColor: Theme.colors.header,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: HeaderStyle.title,
  subtitle: HeaderStyle.subtitle,
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContentsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  locationName: {
    marginRight: 5,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
}

export default function HomeScreen({ navigation }: Params): JSX.Element {
  const location = useContext(LocationContext);
  const [preLive, setPreLive] = useState(false);
  const [live, setLive] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [events, setEvents] = useState<any>([]);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any>([]);
  const [teaching, setTeaching] = useState<VideoData>(null);
  const [note, setNote] = useState<GetNotesQuery['getNotes']>(null);
  const user = useContext(UserContext);

  const locationName = location?.locationData?.locationName;
  const locationId = location?.locationData?.locationId;
  // eslint-disable-next-line camelcase
  const emailVerified = user?.userData?.email_verified;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: function render() {
        return (
          <Header>
            <Left style={{ flexGrow: 1 }} />
            <Button
              style={[style.headerButton, { flexGrow: 0 }]}
              onPress={() =>
                navigation.navigate('LocationSelectionScreen', {
                  persist: !emailVerified,
                })
              }
            >
              <View style={style.buttonContentsContainer}>
                <Text style={style.title}>Home</Text>
                <View style={style.locationContainer}>
                  <Text style={[style.subtitle, style.locationName]}>
                    {locationName === 'unknown'
                      ? 'Select Location'
                      : locationName}
                  </Text>
                  <Thumbnail
                    square
                    source={Theme.icons.white.caretDown}
                    style={{ width: 12, height: 24 }}
                  />
                </View>
              </View>
            </Button>
            <Right style={{ flexGrow: 1, right: 16 }}>
              <Button
                icon
                transparent
                onPress={() => navigation.navigate('ProfileScreen')}
              >
                <Thumbnail
                  square
                  source={
                    emailVerified
                      ? Theme.icons.white.userLoggedIn
                      : Theme.icons.white.user
                  }
                  style={style.icon}
                />
              </Button>
            </Right>
          </Header>
        );
      },
    });
  }, [locationName, navigation, emailVerified]);

  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        const liveStreamsResult = await LiveEventService.startLiveEventService();
        if (liveStreamsResult?.liveEvents)
          setLiveEvents(liveStreamsResult?.liveEvents);
      } catch (error) {
        console.log(error);
      }
    };
    loadLiveStreams();

    const loadAnnouncements = async () => {
      const announcementsResult = await AnnouncementService.loadAnnouncements({
        id: location?.locationData?.locationId,
        name: location?.locationData?.locationName,
      } as Location);
      if (announcementsResult)
        setAnnouncements(announcementsResult)

    }
    loadAnnouncements();

    const loadInstagramImages = async () => {
      const data = await InstagramService.getInstagramByLocation(
        locationId ?? ''
      );
      setImages(data.images);
      setInstaUsername(data.username);
    };
    loadInstagramImages();
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const eventsResult = await EventsService.loadEventsList({
          id: locationId,
          name: locationName,
        } as Location);
        setEvents(eventsResult);
        setIsLoading(false);
      } catch (error) {
        setEvents([]);
        setIsLoading(false);
        console.log(error);
      }
    };
    if (locationId !== 'unknown' || locationName !== 'unknown') loadEvents();
  }, [locationId, locationName]);

  const sendQuestion = () => {
    Linking.openURL('mailto:ask@themeetinghouse.com');
  };

  useEffect(() => {
    if (appStateVisible === 'active' && liveEvents && liveEvents.length > 0) {
      const interval = setInterval(() => {
        if (!navigation.isFocused()) {
          clearInterval(interval); // clears interval on navigate away
          return;
        }
        const rightNow = moment()
          .utcOffset(moment().isDST() ? '-0400' : '-0500')
          .format('HH:mm');

        const current = liveEvents.filter((event: any) => {
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
          if (rightNow > liveEvents[liveEvents.length - 1]?.endTime) {
            // Ends for the day
            clearInterval(interval);
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [appStateVisible, liveEvents, navigation]);

  const handleAppStateChange = (nextAppState: any) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const getLastSunday = () => {
    const lastSunday = moment();
    if (lastSunday.isoWeekday() < 7) {
      lastSunday.isoWeekday(0);
    }
    return lastSunday.format('YYYY-MM-DD');
  };

  useEffect(() => {
    const load = async () => {
      const query: GetVideoByVideoTypeQueryVariables = {
        videoTypes: 'adult-sunday',
        limit: 1,
        sortDirection: ModelSortDirection.DESC,
      };
      const json = (await API.graphql(
        graphqlOperation(getVideoByVideoType, query)
      )) as GraphQLResult<GetVideoByVideoTypeQuery>;
      if (json.data?.getVideoByVideoType?.items?.[0]) {
        const noteJson = await NotesService.loadNotesNoContent(getLastSunday());
        setNote(noteJson);
        setTeaching(json.data.getVideoByVideoType.items[0]);
      }
    };
    load();
  }, []);

  return (
    <Container>
      {preLive || live ? (
        <AnnouncementBar
          message={preLive ? 'We will be going live soon!' : 'We are live now!'}
        />
      ) : null}

      <Content style={{ backgroundColor: Theme.colors.background, flex: 1 }}>
        <View style={style.categoryContainer}>
          <RecentTeaching teaching={teaching} note={note} />
          <View style={[style.categoryContainer, { paddingHorizontal: '5%' }]}>
            <WhiteButton
              outlined
              label="Send Question"
              style={{ height: 56 }}
              onPress={sendQuestion}
            />
          </View>
        </View>
        <View style={style.categoryContainer}>
          {announcements.length > 0 ? announcements.map((announcement: Announcement) => (
            <AnnouncementCard
              key={announcement?.id}
              announcement={announcement}
              handlePress={() =>
                navigation.push('AnnouncementDetailsScreen', { item: announcement as Announcement })
              } />
          )) : announcements.length === 0 ? null : <View><ActivityIndicator></ActivityIndicator></View>}
        </View>
        {locationId !== 'unknown' || locationName !== 'unknown' ? (
          <View style={style.categoryContainer}>
            {isLoading ? (
              <View style={{ height: 500 }}>
                <ActivityIndicator />
              </View>
            ) : (
              <>
                {events && events.length ? (
                  <>
                    <Text style={style.categoryTitle}>Upcoming Events</Text>
                    {events.map((event: any) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        handlePress={() =>
                          navigation.navigate('EventDetailsScreen', {
                            item: event,
                          })
                        }
                      />
                    ))}
                  </>
                ) : (
                  <Text style={style.categoryTitle}>No Upcoming Events</Text>
                )}
              </>
            )}
          </View>
        ) : null}

        {/* This should fallback to main TMH Site instead */}
        {images && images.length > 1 ? (
          <View style={style.categoryContainer}>
            <Text style={style.categoryTitle}>@{instaUsername}</Text>
            <InstagramFeed images={images} />
            <AllButton
              handlePress={() =>
                Linking.openURL(`https://instagram.com/${instaUsername}`)
              }
              icon={Theme.icons.white.instagram}
            >
              Follow us on Instagram
            </AllButton>
          </View>
        ) : null}
      </Content>
    </Container>
  );
}
