import React from 'react';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigatorParamList, HomeStackParamList } from './MainTabNavigator';
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

export type MainStackParamList = {
  Main: undefined | { screen: keyof TabNavigatorParamList, params: { screen: keyof HomeStackParamList } };
  Auth: undefined | { screen: keyof AuthStackParamList };
  NotesScreen: { date: string };
  MiniPlayer: undefined;
  ProfileScreen: undefined;
  AccountScreen: undefined;
  ChangePasswordScreen: undefined;
  LocationSelectionScreen: { persist: boolean };
  HighlightScreen: { highlights: any[] };
  DateRangeSelectScreen: undefined;
  SermonLandingScreen: { item: any };
  CommentScreen: { key: string, noteId: string, commentType: CommentDataType, noteType: 'notes' | 'questions', textSnippet?: string, imageUri?: string } | { commentId: string, comment: string, tags: Array<string | null>, textSnippet?: string, imageUri?: string, commentType: CommentDataType, noteId: string };
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
    </Main.Navigator>
  )
}
