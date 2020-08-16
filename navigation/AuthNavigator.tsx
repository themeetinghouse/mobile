import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ConfirmSignUp from '../screens/Auth/ConfirmSignUp';
import LocationSelectionScreen from '../screens/Auth/LocationSelectionScreen';
import SignUp from '../screens/Auth/SignUp';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

export type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined | { locationName: string, locationId: string };
  LocationSelectionScreen: undefined;
  ForgotPasswordScreen: undefined;
  ConfirmSignUpScreen: undefined;
}

const Auth = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator(): JSX.Element {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }} >
      <Auth.Screen name="LoginScreen" component={Login}></Auth.Screen>
      <Auth.Screen name="SignUpScreen" component={SignUp}></Auth.Screen>
      <Auth.Screen name="LocationSelectionScreen" component={LocationSelectionScreen}></Auth.Screen>
      <Auth.Screen name="ForgotPasswordScreen" component={ForgotPassword}></Auth.Screen>
      <Auth.Screen name="ConfirmSignUpScreen" component={ConfirmSignUp}></Auth.Screen>
    </Auth.Navigator>
  )
}