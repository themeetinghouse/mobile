import React, { useEffect, useState } from 'react';
import { Container, Text, Content, View } from 'native-base';
import AllButton from '../components/buttons/AllButton';
import LocationSelectHeader from '../components/LocationSelectHeader/LocationSelectHeader';
import { Theme, Style } from '../Theme.style';
import EventCard from '../components/home/EventCard/EventCard';
import RecentTeaching from '../components/home/RecentTeaching/RecentTeaching';
import AnnouncementCard from '../components/home/AnnouncementCard/AnnouncementCard';
import AnnouncementService from '../services/AnnouncementService';
import SeriesService from '../services/SeriesService';
import EventsService from '../services/EventsService';
import { connect } from 'react-redux';
import SermonsService from '../services/SermonsService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';


const style = {
  categoryContainer: {
    backgroundColor: Theme.colors.black,
    paddingTop: 32,
  },
  categoryTitle: [Style.categoryTitle, {}]  
}

function HomeScreen({ navigation, location, dispatch }){
  
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [recentTeaching, setRecentTeaching] = useState({loading: true, items: [], nextToken: null});

  useEffect(() => {
    let loadAnnouncements = async () => {
      const announcementsResult = await AnnouncementService.loadAnnouncements();
      setAnnouncements(announcementsResult);
    } 
    loadAnnouncements();

    let loadEvents = async () => {
      const eventsResult = await EventsService.loadEventsList(location);
      setEvents(eventsResult);
    } 
    loadEvents();

    const loadRecentTeaching = async () => {
      loadSomeAsync(SermonsService.loadRecentSermonsList, recentTeaching, setRecentTeaching, 1)
    }
    loadRecentTeaching();

  }, [])

  console.log('HomeScreen.render(): location = ', location)

  return (
    <Container>
      <LocationSelectHeader>Home</LocationSelectHeader>
      <Content style={{backgroundColor: Theme.colors.background}}>
        { recentTeaching.loading &&
          <ActivityIndicator/>
        }
        { recentTeaching.items.length > 0 && 
          <View style={style.categoryContainer}>
            <RecentTeaching teaching={recentTeaching.items[0]} navigation={navigation}></RecentTeaching>
          </View>
        }

        <View style={style.categoryContainer}>
          { announcements.map(announcement => (
            <AnnouncementCard 
              key={announcement.id} 
              announcement={announcement} 
              handlePress={() => 
                navigation.push('AnnouncementDetailsScreen', { item: announcement })
              }>
            </AnnouncementCard>
          ))}
          <AllButton>See all announcements</AllButton>
        </View>


        <View style={style.categoryContainer}>
          <Text style={style.categoryTitle}>Upcoming Events</Text>
          { events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              handlePress={() =>
                navigation.push('EventDetailsScreen', { item: event })
              }></EventCard>
          ))}
          <AllButton>See All Events</AllButton>
        </View>

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

HomeScreen.navigationOptions = {
  header: null,
};


// function DevelopmentModeNotice() {
//   if (__DEV__) {
//     const learnMoreButton = (
//       <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
//         Learn more
//       </Text>
//     );

//     return (
//       <Text style={styles.developmentModeText}>
//         Development mode is enabled: your app will be slower but you can use
//         useful development tools. {learnMoreButton}
//       </Text>
//     );
//   } else {
//     return (
//       <Text style={styles.developmentModeText}>
//         You are not in development mode: your app will run at full speed.
//       </Text>
//     );
//   }
// }

// function handleLearnMorePress() {
//   WebBrowser.openBrowserAsync(
//     'https://docs.expo.io/versions/latest/workflow/development-mode/'
//   );
// }


// const styles = StyleSheet.create({
//   tabBarInfoContainer: {
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//   },
// });

function mapStateToProps(state){
  return {
    location: state.location.location
  }
}

export default connect(mapStateToProps)(HomeScreen);