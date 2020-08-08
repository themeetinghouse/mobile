import React from 'react';
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
import DateRangeSelectScreen from '../screens/DateRangeSelectScreen';
import SermonLandingScreen from '../screens/SermonLandingScreen';
import MoreScreen from '../screens/MoreScreen';
import NotesScreen from '../screens/NotesScreen';
import SeriesLandingScreen from '../screens/SeriesLandingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';

const profileScreens = [
  { name: "ProfileScreen", component: ProfileScreen },
  { name: "AccountScreen", component: AccountScreen },
  { name: "ChangePasswordScreen", component: ChangePasswordScreen },
]

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} ></Stack.Screen>
      <Stack.Screen name="AnnouncementDetailsScreen" component={AnnouncementDetailsScreen} ></Stack.Screen>
      <Stack.Screen name="LocationSelectionScreen" component={LocationSelectionScreen} ></Stack.Screen>
      {profileScreens.map(screen=>{
        return <Stack.Screen key={screen.name} name={screen.name} component={screen.component}></Stack.Screen>
      })}
    </Stack.Navigator>
  )
}

function TeachingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Teaching" component={TeachingScreen}></Stack.Screen>
      <Stack.Screen name="AllSeriesScreen" component={AllSeriesScreen} ></Stack.Screen>
      <Stack.Screen name="AllSermonsScreen" component={AllSermonsScreen} ></Stack.Screen>
      <Stack.Screen name="DateRangeSelectScreen" component={DateRangeSelectScreen} ></Stack.Screen>
      <Stack.Screen name="SeriesLandingScreen" component={SeriesLandingScreen} ></Stack.Screen>
      <Stack.Screen name="SermonLandingScreen" component={SermonLandingScreen} ></Stack.Screen>   
      <Stack.Screen name="NotesScreen" component={NotesScreen} ></Stack.Screen>   
      {profileScreens.map(screen=>{
        return <Stack.Screen key={screen.name} name={screen.name} component={screen.component}></Stack.Screen>
      })}
    </Stack.Navigator>
  )
}

/*function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SettingsScreen}></Stack.Screen>
    </Stack.Navigator>
  )
}*/

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreScreen" component={MoreScreen}></Stack.Screen>
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const style = {
  tabIcon: {
    width: 45,
    height: 45
  }
}

export default function MainTabNavigator(): JSX.Element {
  return (
      <Tab.Navigator 
        tabBarOptions={{ 
          showLabel: false, 
          activeBackgroundColor: 'black', 
          inactiveBackgroundColor: 'black',
          style: {
            height: 90,
            backgroundColor: 'black'
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
        <Tab.Screen name="Home" component={HomeStack}/>
        <Tab.Screen name="Teaching" component={TeachingStack}/>
        <Tab.Screen name="More" component={MoreStack}/>
      </Tab.Navigator>
  )
}