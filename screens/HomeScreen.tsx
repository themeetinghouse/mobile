import React, { useEffect, useState, useContext } from 'react';
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
import { StyleSheet } from 'react-native';
import WhiteButton from '../components/buttons/WhiteButton';
import InstagramService, { InstagramData } from '../services/Instagram';
import InstagramFeed from '../components/home/InstagramFeed';
import * as Linking from 'expo-linking';
import AllButton from '../components/buttons/AllButton';
import AnnouncementBar from "../screens/AnnouncementBar"
import LiveEventService from "../services/LiveEventService"
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
  const [events, setEvents] = useState<any>([]);
  const [images, setImages] = useState<InstagramData>([]);
  const [instaUsername, setInstaUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLiveEvent, setCurrentLiveEvent] = useState<any>(null);
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
  useEffect(() => {
    const interval = setInterval(() => {
      const rightNow = moment().subtract(10, 'hours').subtract(1, 'minutes').format("HH:mm")//moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('06:00')
      console.log(liveEvents)
      if (liveEvents)
        liveEvents.map((event: any) => {

          console.log(rightNow)
          const showTime = event?.startTime && event?.endTime && rightNow >= event.startTime && rightNow <= event.endTime
          if (showTime) {
            setCurrentLiveEvent(event)
            if (rightNow >= event.videoStartTime && rightNow <= event.endTime) {
              setLive(true)
            }
            setpreLive(true)
          }
        })
      if (currentLiveEvent) {
        console.log(currentLiveEvent)
        const start = currentLiveEvent?.videoStartTime
        const end = currentLiveEvent?.endTime

        console.log(`videoStartTime is ${currentLiveEvent?.videoStartTime} endTime is ${currentLiveEvent?.endTime} and current time is ${rightNow}`)
        if (start && end) {
          const showTime = rightNow >= start && rightNow <= end
          if (showTime) {
            //console.log("ShowLive")
            setLive(true)
          }
        }
        else {
          setLive(false)
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Container>
      <LocationSelectHeader>Home</LocationSelectHeader>
      {live || preLive ? <AnnouncementBar message={preLive ? !live ? "We will be going live soon!" : "We are live now!" : ""}></AnnouncementBar> : null}
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