import React from 'react';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import CheckUser from '../screens/Auth/CheckUser';
import { createStackNavigator } from '@react-navigation/stack';

const Main = createStackNavigator();

export default function NavigationRoot(): JSX.Element {
  return (
      <Main.Navigator screenOptions={{ headerShown: false }} initialRouteName="CheckUser">
        <Main.Screen name={"Main"} component={MainTabNavigator}></Main.Screen>
        <Main.Screen name={"CheckUser"} component={CheckUser} ></Main.Screen>
        <Main.Screen name={"Auth"} component={AuthNavigator} ></Main.Screen>
      </Main.Navigator>
  )
}
