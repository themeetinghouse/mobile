import React from 'react';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigatorParamList, HomeStackParamList } from './MainTabNavigator';
import { AuthStackParamList } from './AuthNavigator';

export type MainStackParamList = {
  Main: undefined | { screen: keyof TabNavigatorParamList, params: { screen: keyof HomeStackParamList } };
  Auth: undefined | { screen: keyof AuthStackParamList };
}

const Main = createStackNavigator<MainStackParamList>();

export default function NavigationRoot(): JSX.Element {
  return (
    <Main.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
      <Main.Screen name={"Main"} component={MainTabNavigator}></Main.Screen>
      <Main.Screen name={"Auth"} component={AuthNavigator} ></Main.Screen>
    </Main.Navigator>
  )
}
