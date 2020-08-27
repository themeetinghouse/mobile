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
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import HighlightScreen from '../screens/HighlightScreen';
import DateRangeSelectScreen from '../screens/DateRangeSelectScreen';
import SermonLandingScreen from '../screens/SermonLandingScreen';
import MoreScreen from '../screens/MoreScreen';
import NotesScreen from '../screens/NotesScreen';
import SeriesLandingScreen from '../screens/SeriesLandingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import { Theme } from '../Theme.style';
import MediaContext from '../contexts/MediaContext'

export type HomeStackParamList = {
  HomeScreen: undefined;
  EventDetailsScreen: { item: any };
  AnnouncementDetailsScreen: { item: any };
  LocationSelectionScreen: { persist: boolean };
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
}

const Home = createStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="HomeScreen" component={HomeScreen}></Home.Screen>
      <Home.Screen name="EventDetailsScreen" component={EventDetailsScreen} ></Home.Screen>
      <Home.Screen name="AnnouncementDetailsScreen" component={AnnouncementDetailsScreen} ></Home.Screen>
      <Home.Screen name="LocationSelectionScreen" component={LocationSelectionScreen} ></Home.Screen>
      <Home.Screen name="ProfileScreen" component={ProfileScreen}></Home.Screen>
      <Home.Screen name="AccountScreen" component={AccountScreen}></Home.Screen>
      <Home.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}></Home.Screen>
    </Home.Navigator>
  )
}

export type TeachingStackParamList = {
  Teaching: undefined;
  AllSeriesScreen: undefined;
  AllSermonsScreen: { startDate: string, endDate: string } | undefined;
  DateRangeSelectScreen: undefined;
  SeriesLandingScreen: { seriesId?: string, item?: any };
  SermonLandingScreen: { item: any };
  NotesScreen: { date: string };
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
  HighlightScreen: { highlights: any, index: number };
}

const Teaching = createStackNavigator<TeachingStackParamList>();

function TeachingStack() {

  return (
    <Teaching.Navigator screenOptions={{ headerShown: false }}>
      <Teaching.Screen name="Teaching" component={TeachingScreen}></Teaching.Screen>
      <Teaching.Screen name="AllSeriesScreen" component={AllSeriesScreen} ></Teaching.Screen>
      <Teaching.Screen name="AllSermonsScreen" component={AllSermonsScreen} ></Teaching.Screen>
      <Teaching.Screen name="DateRangeSelectScreen" component={DateRangeSelectScreen} ></Teaching.Screen>
      <Teaching.Screen name="SeriesLandingScreen" component={SeriesLandingScreen} ></Teaching.Screen>
      <Teaching.Screen name="SermonLandingScreen" component={SermonLandingScreen} ></Teaching.Screen>
      <Teaching.Screen name="NotesScreen" component={NotesScreen} ></Teaching.Screen>
      <Teaching.Screen name="ProfileScreen" component={ProfileScreen}></Teaching.Screen>
      <Teaching.Screen name="AccountScreen" component={AccountScreen}></Teaching.Screen>
      <Teaching.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}></Teaching.Screen>
      <Teaching.Screen name="HighlightScreen" component={HighlightScreen}></Teaching.Screen>
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
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
}

const More = createStackNavigator<MoreStackParamList>();

function MoreStack() {
  return (
    <More.Navigator screenOptions={{ headerShown: false }}>
      <More.Screen name="MoreScreen" component={MoreScreen}></More.Screen>
      <More.Screen name="ProfileScreen" component={ProfileScreen}></More.Screen>
      <More.Screen name="AccountScreen" component={AccountScreen}></More.Screen>
      <More.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}></More.Screen>
    </More.Navigator>
  )
}

export type TabNavigatorParamList = {
  Home: undefined | { screen: keyof HomeStackParamList, params: HomeStackParamList[keyof HomeStackParamList] };
  Teaching: undefined | { screen: keyof TeachingStackParamList, params: TeachingStackParamList[keyof TeachingStackParamList] };
  More: undefined | { screen: keyof MoreStackParamList, params: MoreStackParamList[keyof MoreStackParamList] };
}

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const style = {
  tabIcon: {
    width: 45,
    height: 45
  }
}

export default function MainTabNavigator(): JSX.Element {

  const media = useContext(MediaContext);

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