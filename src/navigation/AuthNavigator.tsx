import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ConfirmSignUp from '../screens/auth/ConfirmSignUp';
import LocationSelectionScreen from '../screens/auth/LocationSelectionScreen';
import SignUp from '../screens/auth/SignUp';

export type AuthStackParamList = {
  LoginScreen: undefined | { newUser?: boolean; email?: string };
  SignUpScreen: undefined | { locationName: string; locationId: string };
  LocationSelectionScreen: undefined;
  ForgotPasswordScreen: undefined;
  ConfirmSignUpScreen: undefined | { email: string };
};

const Auth = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator(): JSX.Element {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="LoginScreen" component={Login} />
      <Auth.Screen name="SignUpScreen" component={SignUp} />
      <Auth.Screen
        name="LocationSelectionScreen"
        component={LocationSelectionScreen}
      />
      <Auth.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
      <Auth.Screen name="ConfirmSignUpScreen" component={ConfirmSignUp} />
    </Auth.Navigator>
  );
}
