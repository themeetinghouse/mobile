import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Content, View, Text } from 'native-base';
//import AllButton from '../components/buttons/AllButton';
import LocationSelectHeader from '../components/LocationSelectHeader/LocationSelectHeader';
import { Theme, Style } from '../Theme.style';
import EventCard from '../components/home/EventCard/EventCard';
import RecentTeaching from '../components/home/RecentTeaching/RecentTeaching';
//import AnnouncementCard from '../components/home/AnnouncementCard/AnnouncementCard';
// import AnnouncementService from '../services/AnnouncementService';
//import SeriesService from '../services/SeriesService';
import EventsService from '../services/EventsService';
// import SermonsService from '../services/SermonsService';
// import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import LocationContext from '../contexts/LocationContext'
import { Location } from "../services/LocationsService";
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from "moment";
import { StyleSheet, AppState } from 'react-native';
import WhiteButton from '../components/buttons/WhiteButton';
import InstagramService, { InstagramData } from '../services/Instagram';
import InstagramFeed from '../components/home/InstagramFeed';
import * as Linking from 'expo-linking';
import AllButton from '../components/buttons/AllButton';
import AnnouncementBar from "../screens/AnnouncementBar"
import LiveEventService from "../services/LiveEventService"
import { NavigationRouteContext } from '@react-navigation/native';
const style = StyleSheet.create({
  categoryContainer: {
    backgroundColor: Theme.colors.black,
    paddingTop: 32,
  },
  categoryTitle: Style.categoryTitle,
})

interface Params {
  navigation: StackNavigationProp<HomeStackParamList>;
}

export default function HomeScreen({ navigation }: Params): JSX.Element {

  const location = useContext(LocationContext);
  const [preLive, setpreLive] = useState(false)
  const [live, setLive] = useState(false);
  //const [announcements, setAnnouncements] = useState<any>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [events, setEvents] = useState<any>([]);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any>(null);

  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        const liveStreamsResult = await LiveEventService.startLiveEventService()
        if (liveStreamsResult?.liveEvents)
          setLiveEvents(liveStreamsResult?.liveEvents)
      }
      catch (error) {
        console.log(error)
      }
    }
    loadLiveStreams();
    /*
    const loadAnnouncements = async () => {
      const announcementsResult = await AnnouncementService.loadAnnouncements();
      setAnnouncements(announcementsResult);
    }
    loadAnnouncements();
    */
    const loadInstagramImages = async () => {
      const data = await InstagramService.getInstagramByLocation(location?.locationData?.locationId ?? '')
      setImages(data.images);
      setInstaUsername(data.username);
    }
    loadInstagramImages();
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const eventsResult = await EventsService.loadEventsList({ id: location?.locationData?.locationId, name: location?.locationData?.locationName } as Location)
        setEvents(await eventsResult);
        setIsLoading(false)
      }
      catch (error) {
        setEvents([])
        setIsLoading(false)
        console.log(error)
      }
    }
    if (location?.locationData?.locationId !== "unknown" || location?.locationData?.locationName !== "unknown")
      loadEvents();
  }, [location])

  const sendQuestion = () => {
    Linking.openURL('mailto:ask@themeetinghouse.com');
  }
  const latestEventTime = (liveEvents: any) => {
    const endTimes = liveEvents.map((event: any, index: number) => {
      return event.endTime
    })
    const arr = endTimes.sort((a: any, b: any) => {
      if (a.endTime > b.endTime) {
        console.log(a.endTime + "is greater than " + b.endTime)
        return 1;
      }
      if (a.endTime < b.endTime) {
        console.log(a.endTime + "is less than  " + b.endTime)
        return -1;
      }
      return 0
    })
    console.log("sorted " + arr)
  }

  useEffect(() => {
    console.log("Events for today:")
    console.log(liveEvents)
    if (liveEvents) {
      latestEventTime(liveEvents)
      const interval = setInterval(() => {
        if (!navigation.isFocused()) {
          clearInterval(interval) // clears interval on navigate away
          return;
        }
        const rightNow = moment().format("HH:mm")//moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('06:00')
        console.log("Tick: " + rightNow + ":" + moment().format("ss"))
        const current = liveEvents.filter((event: any) => {
          return event?.startTime && event?.endTime && rightNow >= event.startTime && rightNow <= event.endTime
        })[0]
        if (current && rightNow <= current.endTime) {
          console.log("\n====================================================")
          console.log("Prelive: " + preLive)
          console.log("live: " + live)
          console.log(`videoStartTime is ${current?.videoStartTime} endTime is ${current?.endTime} and current time is ${rightNow}`)
          console.log(current)
          if (rightNow >= current.startTime && rightNow < current.videoStartTime) {
            setpreLive(true)
          }
          else {
            setpreLive(false)
          }
          const start = current?.videoStartTime
          const end = current?.endTime
          const showTime = rightNow >= start && rightNow <= end
          if (showTime) {
            if (preLive) setpreLive(false)
            setLive(true)
          }
          console.log("====================================================\n")
        } else {

          setLive(false)
          setpreLive(false)
          if (rightNow > liveEvents[1].endTime) { //this is assuming there are only 2 events in a liveEvent result and one of them is afterparty.
            clearInterval(interval)
            console.log("Events ended.")
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [liveEvents, appStateVisible]);

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
  useEffect(() => {
    console.log(appStateVisible)
  }, [appStateVisible])
  return (
    <Container>
      <LocationSelectHeader>Home</LocationSelectHeader>
      {preLive === true ? <AnnouncementBar message={"We will be going live soon!"}></AnnouncementBar> :
        live === true ? <AnnouncementBar message={"We are live now!"}></AnnouncementBar> : null}
      <Content style={{ backgroundColor: Theme.colors.background, flex: 1 }}>

        <View style={[style.categoryContainer, { paddingBottom: 48 }]}>
          <RecentTeaching />
          <View style={[style.categoryContainer, { paddingHorizontal: '5%' }]} >
            <WhiteButton outlined label="Send Question" style={{ height: 56 }} onPress={sendQuestion}></WhiteButton>
          </View>
        </View>
        {location?.locationData?.locationId !== "unknown" || location?.locationData.locationName !== "unknown" ?
          <View style={style.categoryContainer}>
            {isLoading ? <ActivityIndicator /> : <>
              {events !== null && events.length !== 0 ?
                <>
                  <Text style={style.categoryTitle} >Upcoming Events</Text>
                  {events.map((event: any) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      handlePress={() =>
                        navigation.push('EventDetailsScreen', { item: event })
                      }></EventCard>

                  ))}
                </>
                : <Text style={style.categoryTitle} >No Upcoming Events</Text>}
            </>}
          </View> : null}

        {/*This should fallback to main TMH Site instead*/}
        {images && images.length > 1 ? <View style={style.categoryContainer}>
          <Text style={style.categoryTitle}>@{instaUsername}</Text>
          <InstagramFeed images={images} />
          <AllButton handlePress={() => Linking.openURL(`https://instagram.com/${instaUsername}`)} icon={Theme.icons.white.instagram}>Follow us on Instagram</AllButton>
        </View> : null}


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
    </Container >
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

    //           // Doesnt' work
    //           //props.navigation.navigate({routeName: 'Links', params: {}, action: NavigationActions.navigate({ routeName: 'Details2' })});
    //           //props.navigation.navigate('Details2');
    //           //props.navigation.navigate({routeName: 'Links'});


    //           //xxxprops.navigation.navigate({routeName: 'Links2', params: {}, action: NavigationActions.navigate({ routeName: 'Details' })});
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