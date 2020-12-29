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
//import AllButton from '../components/buttons/AllButton';
import { Theme, Style, HeaderStyle } from "../Theme.style";
import EventCard from "../components/home/EventCard/EventCard";
import RecentTeaching from "../components/home/RecentTeaching/RecentTeaching";
import AnnouncementCard from '../components/home/AnnouncementCard/AnnouncementCard';
import AnnouncementService, { Announcement } from '../services/AnnouncementService';
//import SeriesService from '../services/SeriesService';
import EventsService from "../services/EventsService";
// import SermonsService from '../services/SermonsService';
// import { loadSomeAsync } from '../utils/loading';
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [events, setEvents] = useState<any>([]);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any>([]);
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
          clearInterval(interval);
          setLive(false);
          setpreLive(false);
          return;
        }
        if (current && rightNow <= current.endTime) {
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
            clearInterval(interval);
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

  return (
    <Container>
      {preLive === true ? (
        <AnnouncementBar
          message={"We will be going live soon!"}
        ></AnnouncementBar>
      ) : live === true ? (
        <AnnouncementBar message={"We are live now!"}></AnnouncementBar>
      ) : null}
      <Content style={{ backgroundColor: Theme.colors.background, flex: 1 }}>
        <View style={[style.categoryContainer]}>
          <RecentTeaching />
          <View style={[style.categoryContainer, { paddingHorizontal: "5%" }]}>
            <WhiteButton
              outlined
              label="Send Question"
              style={{ height: 56 }}
              onPress={sendQuestion}
            ></WhiteButton>
          </View>

        </View>
        <View style={style.categoryContainer}>
          {announcements.length > 0 ? announcements.map((announcement: Announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              handlePress={() =>
                navigation.push('AnnouncementDetailsScreen', { item: announcement as Announcement })
              } />
          )) : announcements.length === 0 ? null : <View><ActivityIndicator></ActivityIndicator></View>}
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
                    {events !== null && events.length !== 0 ? (
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
