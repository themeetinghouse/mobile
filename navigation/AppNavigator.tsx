import React from 'react';
import MainTabNavigator, {
  TabNavigatorParamList,
  HomeStackParamList,
  TeachingStackParamList,
  MoreStackParamList
} from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './AuthNavigator';
import NotesScreen from '../screens/NotesScreen';
import CommentScreen from '../screens/CommentScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import HighlightScreen from '../screens/HighlightScreen';
import DateRangeSelectScreen from '../screens/DateRangeSelectScreen';
import SermonLandingScreen from '../screens/SermonLandingScreen';
import { CommentDataType } from '../services/API';
import LiveStreamScreen from "../screens/LiveStreamScreen";
import TeacherList from "../screens/staff/TeacherList";

export type MainStackParamList = {
  Main: undefined | {
    screen: keyof TabNavigatorParamList, params: {
      screen:
      keyof HomeStackParamList |
      keyof TeachingStackParamList |
      keyof MoreStackParamList,
      params: any
    }
  };
  Auth: undefined | { screen: keyof AuthStackParamList };
  NotesScreen: { date: string };
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
  LocationSelectionScreen: { persist: boolean };
  HighlightScreen: { highlights: any[], nextToken: string | undefined };
  DateRangeSelectScreen: undefined;
  SermonLandingScreen: { item: any };
  LiveStreamScreen: undefined;
  StaffList: undefined;
  ParishTeam: undefined;
  TeacherList: undefined;
  CommentScreen: {
    key: string,
    noteId: string,
    commentType: CommentDataType,
    noteType: 'notes' | 'questions',
    textSnippet?: string,
    imageUri?: string
  } | {
    commentId: string,
    comment: string,
    tags: Array<string | null>,
    textSnippet?: string,
    imageUri?: string,
    commentType: CommentDataType,
    noteId: string
  };
}

const Main = createStackNavigator<MainStackParamList>();

export default function NavigationRoot(): JSX.Element {
  return (
    <Main.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main" headerMode="screen">
      <Main.Screen name="Main" component={MainTabNavigator} />
      <Main.Screen name="Auth" component={AuthNavigator} />
      <Main.Screen name="NotesScreen" component={NotesScreen} />
      <Main.Screen name="ProfileScreen" component={ProfileScreen} />
      <Main.Screen name="AccountScreen" component={AccountScreen} />
      <Main.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Main.Screen name="LocationSelectionScreen" component={LocationSelectionScreen} />
      <Main.Screen name="HighlightScreen" component={HighlightScreen} />
      <Main.Screen name="DateRangeSelectScreen" component={DateRangeSelectScreen} />
      <Main.Screen name="SermonLandingScreen" component={SermonLandingScreen} />
      <Main.Screen name="CommentScreen" component={CommentScreen} />
      <Main.Screen name="LiveStreamScreen" component={LiveStreamScreen} />
      <Main.Screen name="TeacherList" component={TeacherList} />
    </Main.Navigator>
  )
}
