import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from '../screens/HomeScreen';
import TeachingScreen from '../screens/TeachingScreen';
import AllSeriesScreen from '../screens/AllSeriesScreen';
import AllSermonsScreen from '../screens/AllSermonsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Thumbnail } from 'native-base';

import TabHomeImage from '../assets/icons/tab-home.png';
import TabHomeActiveImage from '../assets/icons/tab-home-active.png';
import TabTeachingImage from '../assets/icons/tab-teaching.png';
import TabTeachingActiveImage from '../assets/icons/tab-teaching-active.png';
import TabSearchImage from '../assets/icons/tab-search.png';
import TabSearchActiveImage from '../assets/icons/tab-search-active.png';
import TabMoreImage from '../assets/icons/tab-more.png';
import TabMoreActiveImage from '../assets/icons/tab-more-active.png';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import AnnouncementDetailsScreen from '../screens/AnnouncementDetailsScreen';
import Theme from '../Theme.style';
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import DateRangeSelectScreen from '../screens/DateRangeSelectScreen';
import SermonLandingScreen from '../screens/SermonLandingScreen';
import MoreScreen from '../screens/MoreScreen';
import NotesScreen from '../screens/NotesScreen';
import SeriesLandingScreen from '../screens/SeriesLandingScreen';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    EventDetailsScreen: {
      screen: EventDetailsScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AnnouncementDetailsScreen: {
      screen: AnnouncementDetailsScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    LocationSelectionScreen: {
      screen: LocationSelectionScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  }
);

const style = {
  tabIcon: {
    width: 45,
    height: 45
  }
}

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => {
      return <Thumbnail square source={focused ? TabHomeActiveImage : TabHomeImage} style={style.tabIcon}></Thumbnail>
  }
    
    // <TabBarIcon
    //   focused={focused}
    //   name={
    //     Platform.OS === 'ios'
    //       ? `ios-information-circle${focused ? '' : '-outline'}`
    //       : 'md-information-circle'
    //   }
    // />
};

HomeStack.path = '';

const TeachingStack = createStackNavigator(
  {
    Teaching: {
      screen: TeachingScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AllSeriesScreen: {
      screen: AllSeriesScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AllSermonsScreen: {
      screen: AllSermonsScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    DateRangeSelectScreen: {
      screen: DateRangeSelectScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    SeriesLandingScreen: {
      screen: SeriesLandingScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    SermonLandingScreen: {
      screen: SermonLandingScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    NotesScreen: {
      screen: NotesScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
  }
);

TeachingStack.navigationOptions = {
  tabBarLabel: 'Teaching',
  tabBarIcon: ({ focused }) => {
    return <Thumbnail square source={focused ? TabTeachingActiveImage : TabTeachingImage} style={style.tabIcon}></Thumbnail>
  }
};

TeachingStack.path = '';

const SearchStack = createStackNavigator(
  {
    Search: SettingsScreen,
  }
);

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => {
    return <Thumbnail square source={focused ? TabSearchActiveImage : TabSearchImage} style={style.tabIcon}></Thumbnail>
  }
};

SearchStack.path = '';

const MoreStack = createStackNavigator(
  {
    MoreScreen: {
      screen: MoreScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
  }
);

MoreStack.navigationOptions = {
  tabBarLabel: 'More',
  tabBarIcon: ({ focused }) => {
    return <Thumbnail square source={focused ? TabMoreActiveImage : TabMoreImage} style={style.tabIcon}></Thumbnail>
  }
};

MoreStack.path = '';

let tabNavigator;
let tabs = { HomeStack, TeachingStack, /*SearchStack,*/ MoreStack }

//if (Platform.OS === "ios"){
  tabNavigator = createBottomTabNavigator(tabs,
    {
      tabBarOptions: {
        activeBackgroundColor: "#000000",
        inactiveBackgroundColor: "#000000",
        showLabel: false,
        style: {
          height: 65
        }
      },
      labeled: false,
      activeColor: "#FFFFFF",
      inactiveColor: "#FFFFFF",
      barStyle: { 
        backgroundColor: '#000000',
        overflow: "visible",
      },
    }
    );

// } else {
//   tabNavigator = createMaterialBottomTabNavigator(tabs, 
//   {
//     labeled: false,
//     activeColor: "#FFFFFF",
//     inactiveColor: "#FFFFFF",
//     barStyle: { 
//       backgroundColor: '#000000',
//       overflow: "visible",
//     },
//   });
// }

tabNavigator.path = '';

export default tabNavigator;
