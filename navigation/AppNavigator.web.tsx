import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
import Auth from '../screens/Auth/Auth';

import MainTabNavigator from './MainTabNavigator';

const switchNavigator = createSwitchNavigator({
  Auth: Auth,
  Main: MainTabNavigator,
}, { initialRouteName: 'Auth' });

export default createBrowserApp(switchNavigator, { history: 'hash' });
