import React, { Fragment } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBarProps, BottomTabBarOptions } from '@react-navigation/bottom-tabs';
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
import { Theme } from '../Theme.style';
import { StyleSheet, View } from 'react-native';
import MiniPlayer from '../components/MiniPlayer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native'

export type HomeStackParamList = {
  HomeScreen: undefined;
  EventDetailsScreen: { item: any };
  AnnouncementDetailsScreen: { item: any };
}

const Home = createStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="HomeScreen" component={HomeScreen} />
      <Home.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Home.Screen name="AnnouncementDetailsScreen" component={AnnouncementDetailsScreen} />
    </Home.Navigator>
  )
}

export type TeachingStackParamList = {
  Teaching: undefined;
  AllSeriesScreen: undefined;
  AllSermonsScreen: { startDate: string, endDate: string } | undefined;
  SeriesLandingScreen: { seriesId?: string, item?: any };
}

const Teaching = createStackNavigator<TeachingStackParamList>();

function TeachingStack() {

  return (
    <Teaching.Navigator screenOptions={{ headerShown: false }}>
      <Teaching.Screen name="Teaching" component={TeachingScreen} />
      <Teaching.Screen name="AllSeriesScreen" component={AllSeriesScreen} />
      <Teaching.Screen name="AllSermonsScreen" component={AllSermonsScreen} />
      <Teaching.Screen name="SeriesLandingScreen" component={SeriesLandingScreen} />
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

  return (
    <Tab.Navigator
      tabBar={props => <MyTabNavigator {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Teaching" component={TeachingStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  )
}

function MyTabNavigator({ state, navigation }: BottomTabBarProps<BottomTabBarOptions>): JSX.Element {

  const safeArea = useSafeAreaInsets();
  const { colors } = useTheme();

  const style = StyleSheet.create({
    tabIcon: {
      width: 45,
      height: 45
    }
  });

  const renderIcon = (focused: boolean, routeName: string) => {
    let icon;

    if (routeName === 'Home') {
      icon = focused
        ? TabHomeActiveImage
        : TabHomeImage;
    } else if (routeName === 'Teaching') {
      icon = focused
        ? TabTeachingActiveImage
        : TabTeachingImage;
    } else if (routeName === 'More') {
      icon = focused
        ? TabMoreActiveImage
        : TabMoreImage;
    }
    return <TouchableWithoutFeedback key={routeName} onPress={() => navigation.navigate(routeName)} >
      <Thumbnail square source={icon} style={style.tabIcon} />
    </TouchableWithoutFeedback>;
  }

  return <Fragment>
    <MiniPlayer />
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: safeArea.bottom,
        paddingTop: 10,
        backgroundColor: Theme.colors.background,
        borderTopColor: colors.border,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 8
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return renderIcon(isFocused, route.name)
      }
      )}
    </View>
  </Fragment>

}


