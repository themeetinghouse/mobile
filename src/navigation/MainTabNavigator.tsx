import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Thumbnail } from 'native-base';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import TeachingScreen from '../screens/teaching/TeachingScreen';
import AllSeriesScreen from '../screens/teaching/AllSeriesScreen';
import AllSermonsScreen from '../screens/teaching/AllSermonsScreen';
import TabHomeImage from '../../assets/icons/tab-home.png';
import TabHomeActiveImage from '../../assets/icons/tab-home-active.png';
import TabTeachingImage from '../../assets/icons/tab-teaching.png';
import TabTeachingActiveImage from '../../assets/icons/tab-teaching-active.png';
import TabMoreImage from '../../assets/icons/tab-more.png';
import TabMoreActiveImage from '../../assets/icons/tab-more-active.png';
import EventDetailsScreen from '../screens/home/EventDetailsScreen';
import AnnouncementDetailsScreen from '../screens/home/AnnouncementDetailsScreen';
import MoreScreen from '../screens/more/MoreScreen';
import SeriesLandingScreen from '../screens/teaching/SeriesLandingScreen';
import PopularTeachingScreen from '../screens/teaching/PopularTeachingScreen';
import { Theme } from '../Theme.style';
import MediaContext from '../contexts/MediaContext';
import { GetVideoByVideoTypeQuery } from '../services/API';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import StaffList from '../screens/staff/StaffList';
import ParishTeam from '../screens/staff/ParishTeam';
import TeacherProfile from '../screens/staff/TeacherProfile';
import {EventQueryResult} from "../services/EventsService";

export type HomeStackParamList = {
  HomeScreen: undefined;
  EventDetailsScreen: { item: NonNullable<EventQueryResult>[0] };
  AnnouncementDetailsScreen: { item: any };
  LiveStreamScreen: undefined;
};

const Home = createStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="HomeScreen" component={HomeScreen} />
      <Home.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Home.Screen
        name="AnnouncementDetailsScreen"
        component={AnnouncementDetailsScreen}
      />
      <Home.Screen name="LiveStreamScreen" component={LiveStreamScreen} />
    </Home.Navigator>
  );
}

type PopularVideoData = NonNullable<
  NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']
>;

export type TeachingStackParamList = {
  Teaching: undefined;
  AllSeriesScreen: { customPlaylists: boolean } | undefined;
  AllSermonsScreen: { startDate: string; endDate: string } | undefined;
  SeriesLandingScreen: {
    seriesId?: string;
    item?: any;
    customPlaylist?: boolean;
  };
  PopularTeachingScreen: { popularTeaching: PopularVideoData };
};

const Teaching = createStackNavigator<TeachingStackParamList>();

function TeachingStack() {
  return (
    <Teaching.Navigator screenOptions={{ headerShown: false }}>
      <Teaching.Screen name="Teaching" component={TeachingScreen} />
      <Teaching.Screen name="AllSeriesScreen" component={AllSeriesScreen} />
      <Teaching.Screen name="AllSermonsScreen" component={AllSermonsScreen} />
      <Teaching.Screen
        name="SeriesLandingScreen"
        component={SeriesLandingScreen}
      />
      <Teaching.Screen
        name="PopularTeachingScreen"
        component={PopularTeachingScreen}
      />
    </Teaching.Navigator>
  );
}

export type MoreStackParamList = {
  // LocationSelectionScreen: any, //this is wrong (?)
  MoreScreen: undefined;
  StaffList: undefined;
  ParishTeam: undefined;
  TeacherProfile: { staff: any } | undefined;
};

const More = createStackNavigator<MoreStackParamList>();

function MoreStack() {
  return (
    <More.Navigator screenOptions={{ headerShown: false }}>
      <More.Screen name="MoreScreen" component={MoreScreen} />
      <More.Screen name="StaffList" component={StaffList} />
      <More.Screen name="TeacherProfile" component={TeacherProfile} />
      <More.Screen name="ParishTeam" component={ParishTeam} />
    </More.Navigator>
  );
}

export type TabNavigatorParamList = {
  Home:
    | undefined
    | {
        screen: keyof HomeStackParamList;
        params: HomeStackParamList[keyof HomeStackParamList];
      };
  Teaching:
    | undefined
    | {
        screen: keyof TeachingStackParamList;
        params: TeachingStackParamList[keyof TeachingStackParamList];
      };
  More:
    | undefined
    | {
        screen: keyof MoreStackParamList;
        params: MoreStackParamList[keyof MoreStackParamList];
      };
};

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export default function MainTabNavigator(): JSX.Element {
  type TabBarProps = { focused: boolean };

  const media = useContext(MediaContext);

  const style = StyleSheet.create({
    tabIcon: {
      width: 45,
      height: 45,
    },
  });

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 90,
          backgroundColor: Theme.colors.background,
          marginTop: media.media.playerType.includes('mini') ? 56 : 0,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: function render({ focused }: TabBarProps) {
          let icon;

          if (route.name === 'Home') {
            icon = focused ? TabHomeActiveImage : TabHomeImage;
          } else if (route.name === 'Teaching') {
            icon = focused ? TabTeachingActiveImage : TabTeachingImage;
          } else if (route.name === 'More') {
            icon = focused ? TabMoreActiveImage : TabMoreImage;
          }
          return <Thumbnail square source={icon} style={style.tabIcon} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Teaching" component={TeachingStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
