import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LocationData } from 'src/contexts/LocationContext';
import MainTabNavigator, {
  TabNavigatorParamList,
  HomeStackParamList,
  TeachingStackParamList,
  MoreStackParamList,
} from './MainTabNavigator';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';

import NotesScreen from '../screens/teaching/NotesScreen';
import AllEvents from '../screens/home/AllEvents';
import CommentScreen from '../screens/teaching/CommentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AccountScreen from '../screens/profile/AccountScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import HighlightScreen from '../screens/teaching/HighlightScreen';
import DateRangeSelectScreen from '../screens/teaching/DateRangeSelectScreen';
import SermonLandingScreen from '../screens/teaching/SermonLandingScreen';
import { CommentDataType } from '../services/API';
import LiveStreamScreen from '../screens/LiveStreamScreen';
import TeacherList from '../screens/staff/TeacherList';
import StaffList from '../screens/staff/StaffList';
import ParishTeam from '../screens/staff/ParishTeam';
import TeacherProfile from '../screens/staff/TeacherProfile';
import AskAQuestion from '../screens/home/AskAQuestion';
import { EventQueryResult } from '../services/EventsService';
import MyComments from '../screens/comments/MyComments';
import HomeChurchScreen, {
  HomeChurch,
  HomeChurchData,
} from '../screens/homechurch/HomeChurchScreen';
import HomeChurchMapScreen from '../screens/homechurch/HomeChurchMapScreen';
import HomeChurchLocationSelect from '../screens/homechurch/HomeChurchLocationSelect';

export type MainStackParamList = {
  Main:
    | undefined
    | {
        screen: keyof TabNavigatorParamList;
        params?: {
          screen:
            | keyof HomeStackParamList
            | keyof TeachingStackParamList
            | keyof MoreStackParamList;
          params: any;
        };
      };
  TeacherProfile: { staff: any } | undefined;
  StaffList: undefined;
  ParishTeam: undefined;
  MyComments: undefined;
  Auth: undefined | { screen: keyof AuthStackParamList };
  AskAQuestion: any;
  NotesScreen: { date: string };
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
  LocationSelectionScreen: { persist: boolean };
  HighlightScreen: {
    highlights: any[];
    nextToken: string | undefined;
    fromSeries?: boolean;
  };
  HomeChurchLocationSelect: { location?: LocationData };
  DateRangeSelectScreen: undefined;
  SermonLandingScreen: {
    item: any;
    customPlaylist?: boolean;
    seriesId?: string;
  };
  AllEvents: { events: NonNullable<EventQueryResult> };
  LiveStreamScreen: undefined;
  TeacherList: undefined;
  HomeChurchScreen: { loc?: LocationData };
  CommentScreen:
    | {
        key: string;
        noteId: string;
        commentType: CommentDataType;
        noteType: 'notes' | 'questions';
        textSnippet?: string;
        imageUri?: string;
      }
    | {
        commentId: string;
        comment: string;
        tags: Array<string | null>;
        textSnippet?: string;
        imageUri?: string;
        commentType: CommentDataType;
        noteId: string;
      };
  HomeChurchMapScreen: { items: HomeChurchData; selection?: HomeChurch };
};

const Main = createStackNavigator<MainStackParamList>();

export default function NavigationRoot(): JSX.Element {
  return (
    <Main.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Main"
      headerMode="screen"
    >
      <Main.Screen name="Main" component={MainTabNavigator} />
      <Main.Screen name="Auth" component={AuthNavigator} />
      <Main.Screen name="AskAQuestion" component={AskAQuestion} />
      <Main.Screen name="NotesScreen" component={NotesScreen} />
      <Main.Screen name="ProfileScreen" component={ProfileScreen} />
      <Main.Screen name="AccountScreen" component={AccountScreen} />
      <Main.Screen name="AllEvents" component={AllEvents} />
      <Main.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Main.Screen
        name="LocationSelectionScreen"
        component={LocationSelectionScreen}
      />
      <Main.Screen name="HighlightScreen" component={HighlightScreen} />
      <Main.Screen
        name="DateRangeSelectScreen"
        component={DateRangeSelectScreen}
      />
      <Main.Screen name="SermonLandingScreen" component={SermonLandingScreen} />
      <Main.Screen name="TeacherProfile" component={TeacherProfile} />
      <Main.Screen name="StaffList" component={StaffList} />
      <Main.Screen name="ParishTeam" component={ParishTeam} />
      <Main.Screen name="CommentScreen" component={CommentScreen} />
      <Main.Screen name="MyComments" component={MyComments} />
      <Main.Screen name="HomeChurchScreen" component={HomeChurchScreen} />
      <Main.Screen
        name="HomeChurchLocationSelect"
        component={HomeChurchLocationSelect}
      />
      <Main.Screen name="LiveStreamScreen" component={LiveStreamScreen} />
      <Main.Screen name="TeacherList" component={TeacherList} />
      <Main.Screen name="HomeChurchMapScreen" component={HomeChurchMapScreen} />
    </Main.Navigator>
  );
}
