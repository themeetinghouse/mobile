import React, { useContext, useLayoutEffect, useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { locale, locales } from 'moment';
import { Announcement } from '../../src/services/AnnouncementService';
import LocationContext from '../../src/contexts/LocationContext';
import UserContext from '../../src/contexts/UserContext';
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
import MoreScreen, { getUserType } from '../screens/more/MoreScreen';
import SeriesLandingScreen from '../screens/teaching/SeriesLandingScreen';
import PopularTeachingScreen from '../screens/teaching/PopularTeachingScreen';
import { HeaderStyle, Style, Theme } from '../Theme.style';
import MediaContext from '../contexts/MediaContext';
import { GetVideoByVideoTypeQuery } from '../services/API';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import { EventQueryResult } from '../services/EventsService';
import ContentScreen from '../screens/content/ContentScreen';
import useFallbackTabs, { TabItem } from './useFallbackTabs';

const homeStyle = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.gray1,
  },
  categoryDivider: {
    backgroundColor: Theme.colors.gray1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 16,
    borderTopColor: Theme.colors.gray2,
    borderBottomColor: Theme.colors.gray2,
  },
  categoryContainer: {
    backgroundColor: Theme.colors.black,
    paddingTop: 32,
  },
  categoryTitle: Style.categoryTitle,
  headerTitle: HeaderStyle.title,
  icon: Style.icon,
  headerButton: {
    backgroundColor: Theme.colors.header,
    paddingLeft: 40,
  },
  title: HeaderStyle.title,
  subtitle: HeaderStyle.subtitle,
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContentsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  locationName: {
    marginRight: 5,
  },
});
export type HomeStackParamList = {
  HomeScreen: { questionResult?: boolean };
  ContentScreen: undefined;
  EventDetailsScreen: { item: NonNullable<EventQueryResult>[0] };
  AnnouncementDetailsScreen: { item: Announcement };
  LiveStreamScreen: undefined;
};

const Home = createStackNavigator<HomeStackParamList>();
function HomeStack() {
  const user = useContext(UserContext);
  const location = useContext(LocationContext);
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen
        options={({ navigation }) => ({
          title: 'Home',
          headerShown: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitle: () => (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LocationSelectionScreen', {
                    persist: !user?.userData?.email_verified,
                  })
                }
              >
                <View style={homeStyle.buttonContentsContainer}>
                  <Text style={homeStyle.title}>Home</Text>
                  <View style={homeStyle.locationContainer}>
                    <Text style={[homeStyle.subtitle, homeStyle.locationName]}>
                      {location?.locationData?.name === 'unknown'
                        ? 'Select Location'
                        : location?.locationData?.name}
                    </Text>
                    <Image
                      source={Theme.icons.white.caretDown}
                      style={{ width: 12, height: 24 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: HeaderStyle.title,
          headerStyle: {
            backgroundColor: Theme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: Theme.colors.gray2,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerLeft: () => null,
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{ alignContent: 'flex-end', marginRight: 16 }}
                onPress={() => navigation.navigate('ProfileScreen')}
              >
                <Image
                  source={
                    user?.userData?.email_verified
                      ? Theme.icons.white.userLoggedIn
                      : Theme.icons.white.user
                  }
                  style={[homeStyle.icon]}
                />
              </TouchableOpacity>
            );
          },
        })}
        name="HomeScreen"
        component={HomeScreen}
      />
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

type JSONTabLinkItem = {
  name: string;
  visible: boolean;
  groups: Array<string>;
};

export default function MainTabNavigator(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [tabItems, setTabItems] = useState<Array<TabItem>>([]);
  const fallbackTabs = useFallbackTabs();

  const loadMenu = async () => {
    try {
      const response: any = await fetch(
        'https://www.themeetinghouse.com/static/app/data/tabs.json'
      ); // this returns status 200 even when fail
      if (response?.headers?.map?.['content-type'] === 'application/json') {
        const jsonItems: Array<JSONTabLinkItem> = await response.json();
        const groups: Array<string> = await getUserType();
        groups.push('default');
        const transformedItems: Array<TabItem> = jsonItems
          .filter((linkItem) => {
            for (let i = 0; i < linkItem.groups.length; i++) {
              return groups.includes(linkItem.groups[i]);
            }
            return false;
          })
          .map((a: JSONTabLinkItem) => {
            return {
              name: a.name,
              visible: a.visible,
              groups: a.groups,
            };
          });

        setTabItems(transformedItems);
      }
    } catch (err) {
      console.log('Error occurred, falls back to default items');
      setTabItems(fallbackTabs);
    } finally {
      setIsLoading(false);
    }
  };
  useLayoutEffect(() => {
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  type TabBarProps = { focused: boolean };

  const media = useContext(MediaContext);

  const style = StyleSheet.create({
    tabIcon: {
      width: 45,
      height: 45,
    },
  });

  const getTabComponent = (name: string) => {
    switch (name) {
      case 'Home':
        return HomeStack;
      case 'Teaching':
        return TeachingStack;
      case 'Featured':
        return FeaturedStack;
      case 'More':
        return MoreStack;
      default:
        return HomeStack;
    }
  };

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
      {!isLoading ? (
        tabItems.map((item) => {
          return item.visible ? (
            <Tab.Screen
              key={item.name}
              name={item.name as keyof TabNavigatorParamList}
              component={getTabComponent(item.name)}
            />
          ) : null;
        })
      ) : (
        <Tab.Screen name="Home" component={HomeStack} />
      )}
    </Tab.Navigator>
  );
}
