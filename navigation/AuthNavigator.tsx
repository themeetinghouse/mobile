import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ConfirmSignUp from '../screens/Auth/ConfirmSignUp';
import SignUp from '../screens/Auth/SignUp';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Auth = createStackNavigator();

export default function AuthNavigator(): JSX.Element {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }} >
      <Auth.Screen name="LoginScreen" component={Login}></Auth.Screen>
      <Auth.Screen name="SignUpScreen" component={SignUp}></Auth.Screen>
      <Auth.Screen name="ForgotPasswordScreen" component={ForgotPassword}></Auth.Screen>
      <Auth.Screen name="ConfirmSignUpScreen" component={ConfirmSignUp}></Auth.Screen>
    </Auth.Navigator>
  )
}