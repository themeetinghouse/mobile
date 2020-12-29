import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import {
  Container,
  Content,
  View,
  Text,
  Button,
  Thumbnail,
  Left,
  Right,
} from "native-base";
import { Theme, Style, HeaderStyle } from "../Theme.style";
import EventCard from "../components/home/EventCard/EventCard";
import RecentTeaching from "../components/home/RecentTeaching/RecentTeaching";
import EventsService from "../services/EventsService";
import ActivityIndicator from "../components/ActivityIndicator";
import LocationContext from "../contexts/LocationContext";
import { Location } from "../services/LocationsService";
import { HomeStackParamList } from "../navigation/MainTabNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import { StyleSheet, AppState } from "react-native";
import WhiteButton from "../components/buttons/WhiteButton";
import InstagramService, { InstagramData } from "../services/Instagram";
import InstagramFeed from "../components/home/InstagramFeed";
import * as Linking from "expo-linking";
import AllButton from "../components/buttons/AllButton";
import AnnouncementBar from "../screens/AnnouncementBar";
import LiveEventService from "../services/LiveEventService";
import UserContext from "../contexts/UserContext";
import { CompositeNavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "navigation/AppNavigator";
import Header from "../components/Header/Header";
import { GetNotesQuery, GetVideoByVideoTypeQueryVariables, ModelSortDirection, GetVideoByVideoTypeQuery } from "../services/API";
import { VideoData } from '../types';
import { API, GraphQLResult, graphqlOperation } from '@aws-amplify/api';
import NotesService from "../services/NotesService";

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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContentsContainer: {
    display: "flex",
    flexDirection: "column",
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
  const [preLive, setpreLive] = useState(false);
  const [live, setLive] = useState(false);
  //const [announcements, setAnnouncements] = useState<any>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [events, setEvents] = useState<any>([]);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any>([]);
  const [teaching, setTeaching] = useState<VideoData>(null);
  const [note, setNote] = useState<GetNotesQuery['getNotes']>(null);

  const user = useContext(UserContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: function render() {
        return (
          <Header>
            <Left style={{ flexGrow: 1 }}></Left>
            <Button
              style={[style.headerButton, { flexGrow: 0 }]}
              onPress={() =>
                navigation.navigate("LocationSelectionScreen", {
                  persist: !Boolean(user?.userData?.email_verified),
                })
              }
            >
              <View style={style.buttonContentsContainer}>
                <Text style={style.title}>Home</Text>
                <View style={style.locationContainer}>
                  <Text style={[style.subtitle, style.locationName]}>
                    {location?.locationData?.locationName === "unknown"
                      ? "Select Location"
                      : location?.locationData?.locationName}
                  </Text>
                  <Thumbnail
                    square
                    source={Theme.icons.white.caretDown}
                    style={{ width: 12, height: 24 }}
                  ></Thumbnail>
                </View>
              </View>
            </Button>
            <Right style={{ flexGrow: 1, right: 16 }}>
              <Button
                icon
                transparent
                onPress={() => navigation.navigate("ProfileScreen")}
              >
                <Thumbnail
                  square
                  source={
                    user?.userData?.email_verified
                      ? Theme.icons.white.userLoggedIn
                      : Theme.icons.white.user
                  }
                  style={style.icon}
                ></Thumbnail>
              </Button>
            </Right>
          </Header>
        );
      },
    });
  }, [navigation, location, user?.userData]);

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

    /*
    const loadAnnouncements = async () => {
      const announcementsResult = await AnnouncementService.loadAnnouncements();
      setAnnouncements(announcementsResult);
    }
    loadAnnouncements();
    */
    const loadInstagramImages = async () => {
      const data = await InstagramService.getInstagramByLocation(
        location?.locationData?.locationId ?? ""
      );
      setImages(data.images);
      setInstaUsername(data.username);
    };
    loadInstagramImages();
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const eventsResult = await EventsService.loadEventsList({
          id: location?.locationData?.locationId,
          name: location?.locationData?.locationName,
        } as Location);
        setEvents(eventsResult);
        setIsLoading(false);
      } catch (error) {
        setEvents([]);
        setIsLoading(false);
        console.log(error);
      }
    };
    if (
      location?.locationData?.locationId !== "unknown" ||
      location?.locationData?.locationName !== "unknown"
    )
      loadEvents();
  }, [location]);

  const sendQuestion = () => {
    Linking.openURL("mailto:ask@themeetinghouse.com");
  };

  useEffect(() => {
    if (appStateVisible === "active" && liveEvents && liveEvents.length > 0) {
      const interval = setInterval(() => {
        if (!navigation.isFocused()) {
          clearInterval(interval); // clears interval on navigate away
          return;
        }
        const rightNow = moment()
          .utcOffset(moment().isDST() ? "-0400" : "-0500")
          .format("HH:mm");

        const current = liveEvents.filter((event: any) => {
          return (
            event?.startTime &&
            event?.endTime &&
            rightNow >= event.startTime &&
            rightNow <= event.endTime
          );
        })[0];
        if (current?.id.includes("After Party")) {
          /* More logic is required to include After Party message in banner */
          //console.log("Event is After Party. Live has ended. Exiting interval")
          clearInterval(interval);
          setLive(false);
          setpreLive(false);
          return;
        }
        if (current && rightNow <= current.endTime) {
          /*        
          console.log("Tick: " + rightNow + ":" + moment().format("ss"))
          console.log("\n====================================================")
          console.log("Prelive: " + preLive)
          console.log("live: " + live)
          console.log(`videoStartTime is ${current?.videoStartTime} endTime is ${current?.endTime} and current time is ${rightNow}`)
          console.log(current) 
          console.log("====================================================\n")
          */
          if (
            rightNow >= current.startTime &&
            rightNow < current.videoStartTime
          ) {
            setpreLive(true);
          } else {
            setpreLive(false);
          }
          const start = current?.videoStartTime;
          const end = current?.endTime;
          const showTime = rightNow >= start && rightNow <= end;
          if (showTime) {
            if (preLive) setpreLive(false);
            setLive(true);
          }
        } else {
          setLive(false);
          setpreLive(false);
          if (rightNow > liveEvents[liveEvents.length - 1]?.endTime) {
            // Ends for the day
            clearInterval(interval);
            //console.log("Events ended.")
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [appStateVisible, liveEvents]);

  const _handleAppStateChange = (nextAppState: any) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const getLastSunday = () => {
    const lastSunday = moment();
    if (lastSunday.isoWeekday() < 7) {
      lastSunday.isoWeekday(0);
    }
    return lastSunday.format('YYYY-MM-DD');
  }

  useEffect(() => {
    const load = async () => {
      const query: GetVideoByVideoTypeQueryVariables = {
        videoTypes: 'adult-sunday',
        limit: 1,
        sortDirection: ModelSortDirection.DESC,
      }
      const json = await API.graphql(graphqlOperation(getVideoByVideoType, query)) as GraphQLResult<GetVideoByVideoTypeQuery>;
      if (json.data?.getVideoByVideoType?.items?.[0]) {
        const noteJson = await NotesService.loadNotesNoContent(getLastSunday());
        setNote(noteJson);
        setTeaching(json.data.getVideoByVideoType.items[0]);
      }
    }
    load();
  }, [])

  return (
    <Container>
      {preLive ?
        <AnnouncementBar
          message="We will be going live soon!"
        />
        : live ?
          <AnnouncementBar message="We are live now!" />
          : null}
      <Content style={{ backgroundColor: Theme.colors.background, flex: 1 }}>
        <View style={[style.categoryContainer, { paddingBottom: 48 }]}>
          <RecentTeaching teaching={teaching} note={note} />
          <View style={[style.categoryContainer, { paddingHorizontal: "5%" }]}>
            <WhiteButton
              outlined
              label="Send Question"
              style={{ height: 56 }}
              onPress={sendQuestion}
            ></WhiteButton>
          </View>
        </View>
        {location?.locationData?.locationId !== "unknown" ||
          location?.locationData.locationName !== "unknown" ? (
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
                              navigation.navigate("EventDetailsScreen", {
                                item: event,
                              })
                            }
                          ></EventCard>
                        ))}
                      </>
                    ) : (
                        <Text style={style.categoryTitle}>No Upcoming Events</Text>
                      )}
                  </>
                )}
            </View>
          ) : null}

        {/*This should fallback to main TMH Site instead*/}
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

        {/*<View style={style.categoryContainer}>
          {announcements.map((announcement: any) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              handlePress={() =>
                navigation.push('AnnouncementDetailsScreen', { item: announcement })
              } />
          ))}
          <AllButton>See all announcements</AllButton>
            </View>*/}
      </Content>
    </Container>
    // <View style={styles.container}>
    //   <ScrollView
    //     style={styles.container}
    //     contentContainerStyle={styles.contentContainer}>

    //     <View>
    //       <Text>More text here!</Text>
    //       <Button color="purple" title="Click me!" onPress={() => {
    //           console.log('Navigating to details.  props.navigation = %o', props.navigation);
    //           // Works:
    //           //props.navigation.navigate('Details');
    //           props.navigation.navigate({ routeName: 'Details'});
    //           //NavigationActions.navigate({ routeName: 'Links' });

    //           // Doesn't work
    //           //props.navigation.navigate({routeName: 'Links', params: {}, action: NavigationActions.navigate({ routeName: 'Details2' })});
    //           //props.navigation.navigate('Details2');
    //           //props.navigation.navigate({routeName: 'Links'});

    //           //props.navigation.navigate({routeName: 'Links2', params: {}, action: NavigationActions.navigate({ routeName: 'Details' })});
    //           //props.navigation.navigate('Home', {}, NavigationActions.navigate({ routeName: 'Details' }));
    //           //NavigationActions.navigate({ routeName: 'Details' });
    //           //props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Details' }));
    //           // NavigationActions.navigate(
    //           //   { routeName: "Home",
    //           //     action: NavigationActions.navigate({routeName: 'Details'})
    //           //   }
    //           // );
    //       }}></Button>
    //     </View>

    //   </ScrollView>
    // </View>
  );
}

const getVideoByVideoType = `query GetVideoByVideoType(
  $videoTypes: String
  $publishedDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelVideoFilterInput
  $limit: Int
  $nextToken: String
) {
  getVideoByVideoType(
    videoTypes: $videoTypes
    publishedDate: $publishedDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      episodeTitle
      episodeNumber
      seriesTitle
      series {
        id
        title
      }
      speakers{
          items{
              speaker{
                  id
              }
          }
      }
      publishedDate
      description
      length
      viewCount
      YoutubeIdent
      Youtube {
        snippet {
          thumbnails {
            default {
              url
            }
            medium {
              url
            }
            high {
              url
            }
            standard {
              url
            }
            maxres {
              url
            }
          }
        }
      }
      videoTypes
      notesURL
      videoURL
      audioURL
    }
    nextToken
  }
}
`;