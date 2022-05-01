import React, { useContext } from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { Announcement } from 'src/services/AnnouncementService';
import HomeScreen from '../screens/home/HomeScreen';
import TeachingScreen from '../screens/teaching/TeachingScreen';
import AllSeriesScreen from '../screens/teaching/AllSeriesScreen';
import AllSermonsScreen from '../screens/teaching/AllSermonsScreen';
import TabHomeImage from '../../assets/icons/tab-home.png';
import TabHomeActiveImage from '../../assets/icons/tab-home-active.png';
import TabSearchImage from '../../assets/icons/tab-search.png';
import TabSearchActiveImage from '../../assets/icons/tab-search-active.png';
import TabFeatured from '../../assets/icons/tab-featured.png';
import TabFeaturedActive from '../../assets/icons/tab-featured-active.png';
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
import { EventQueryResult } from '../services/EventsService';
import ContentScreen from '../screens/content/ContentScreen';

export type HomeStackParamList = {
  HomeScreen: { questionResult?: boolean };
  ContentScreen: undefined;
  EventDetailsScreen: { item: NonNullable<EventQueryResult>[0] };
  AnnouncementDetailsScreen: { item: Announcement };
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
  AllSeriesScreen:
    | { customPlaylists?: boolean; popularSeries?: boolean }
    | undefined;
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
  MoreScreen: undefined;
};

const More = createStackNavigator<MoreStackParamList>();

function MoreStack() {
  return (
    <More.Navigator screenOptions={{ headerShown: false }}>
      <More.Screen name="MoreScreen" component={MoreScreen} />
    </More.Navigator>
  );
}

export type FeaturedStackParamList = {
  ContentScreen: undefined | { screen: string };
};

const Featured = createStackNavigator<FeaturedStackParamList>();

function FeaturedStack() {
  return (
    <Featured.Navigator
      screenOptions={() => ({
        ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <Featured.Screen name="ContentScreen" component={ContentScreen} />
    </Featured.Navigator>
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
  Featured:
    | undefined
    | {
        screen: keyof FeaturedStackParamList;
        params: FeaturedStackParamList[keyof FeaturedStackParamList];
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
          elevation: 0,
          borderTopColor: Theme.colors.gray2,
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
          } else if (route.name === 'Featured') {
            icon = focused ? TabFeaturedActive : TabFeatured;
          }

          return <Image source={icon} style={style.tabIcon} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Teaching" component={TeachingStack} />
      <Tab.Screen name="Featured" component={FeaturedStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
