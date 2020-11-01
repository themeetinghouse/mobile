import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TeachingScreen from '../screens/TeachingScreen';
import AllSeriesScreen from '../screens/AllSeriesScreen';
import AllSermonsScreen from '../screens/AllSermonsScreen';
//import SettingsScreen from '../screens/SettingsScreen';
import { Thumbnail } from 'native-base';
import TabHomeImage from '../assets/icons/tab-home.png';
import TabHomeActiveImage from '../assets/icons/tab-home-active.png';
import TabTeachingImage from '../assets/icons/tab-teaching.png';
import TabTeachingActiveImage from '../assets/icons/tab-teaching-active.png';
//import TabSearchImage from '../assets/icons/tab-search.png';
//import TabSearchActiveImage from '../assets/icons/tab-search-active.png';
import TabMoreImage from '../assets/icons/tab-more.png';
import TabMoreActiveImage from '../assets/icons/tab-more-active.png';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import AnnouncementDetailsScreen from '../screens/AnnouncementDetailsScreen';
import MoreScreen from '../screens/MoreScreen';
import SeriesLandingScreen from '../screens/SeriesLandingScreen';
import PopularTeachingScreen from '../screens/PopularTeachingScreen';
import { Theme } from '../Theme.style';
import { StyleSheet } from 'react-native';
import MediaContext from '../contexts/MediaContext';
import { GetVideoByVideoTypeQuery } from '../services/API';
import LiveStreamScreen from '../screens/LiveStreamScreen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  EventDetailsScreen: { item: any };
  AnnouncementDetailsScreen: { item: any };
  LiveStreamScreen: undefined;
}

const Home = createStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="HomeScreen" component={HomeScreen} />
      <Home.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Home.Screen name="AnnouncementDetailsScreen" component={AnnouncementDetailsScreen} />
      <Home.Screen name="LiveStreamScreen" component={LiveStreamScreen} />
    </Home.Navigator>
  )
}

type PopularVideoData = NonNullable<NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']>

export type TeachingStackParamList = {
  Teaching: undefined;
  AllSeriesScreen: undefined;
  AllSermonsScreen: { startDate: string, endDate: string } | undefined;
  SeriesLandingScreen: { seriesId?: string, item?: any };
  PopularTeachingScreen: { popularTeaching: PopularVideoData }
}

const Teaching = createStackNavigator<TeachingStackParamList>();

function TeachingStack() {

  return (
    <Teaching.Navigator screenOptions={{ headerShown: false }}>
      <Teaching.Screen name="Teaching" component={TeachingScreen} />
      <Teaching.Screen name="AllSeriesScreen" component={AllSeriesScreen} />
      <Teaching.Screen name="AllSermonsScreen" component={AllSermonsScreen} />
      <Teaching.Screen name="SeriesLandingScreen" component={SeriesLandingScreen} />
      <Teaching.Screen name="PopularTeachingScreen" component={PopularTeachingScreen} />
    </Teaching.Navigator>
  )
}

/*function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SettingsScreen}></Stack.Screen>
    </Stack.Navigator>
  )
}*/

export type MoreStackParamList = {
  MoreScreen: undefined;
}

const More = createStackNavigator<MoreStackParamList>();

function MoreStack() {
  return (
    <More.Navigator screenOptions={{ headerShown: false }}>
      <More.Screen name="MoreScreen" component={MoreScreen} />
    </More.Navigator>
  )
}

export type TabNavigatorParamList = {
  Home: undefined | { screen: keyof HomeStackParamList, params: HomeStackParamList[keyof HomeStackParamList] };
  Teaching: undefined | { screen: keyof TeachingStackParamList, params: TeachingStackParamList[keyof TeachingStackParamList] };
  More: undefined | { screen: keyof MoreStackParamList, params: MoreStackParamList[keyof MoreStackParamList] };
}

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export default function MainTabNavigator(): JSX.Element {

  const media = useContext(MediaContext);

  const style = StyleSheet.create({
    tabIcon: {
      width: 45,
      height: 45
    }
  })

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 90,
          backgroundColor: Theme.colors.background,
          marginTop: media.media.playerType.includes('mini') ? 56 : 0
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: function render({ focused }: { focused: boolean }) {
          let icon;

          if (route.name === 'Home') {
            icon = focused
              ? TabHomeActiveImage
              : TabHomeImage;
          } else if (route.name === 'Teaching') {
            icon = focused
              ? TabTeachingActiveImage
              : TabTeachingImage;
          } else if (route.name === 'More') {
            icon = focused
              ? TabMoreActiveImage
              : TabMoreImage;
          }
          return <Thumbnail square source={icon} style={style.tabIcon}></Thumbnail>;
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Teaching" component={TeachingStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  )
}


