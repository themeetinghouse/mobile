import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
import AuthNavigator from './AuthNavigator';
import CheckUser from '../screens/Auth/CheckUser';
import MainTabNavigator from './MainTabNavigator';

const switchNavigator = createSwitchNavigator({
    CheckUser: CheckUser,
    Auth: AuthNavigator,
    Main: MainTabNavigator,
}, { initialRouteName: 'CheckUser' });

export default createBrowserApp(switchNavigator, { history: 'hash' });