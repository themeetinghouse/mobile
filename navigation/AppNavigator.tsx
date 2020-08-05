import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import Auth from '../screens/Auth/Auth';

export default createAppContainer(
  createSwitchNavigator({
    Auth: Auth,
    Main: MainTabNavigator,
  }, { initialRouteName: 'Auth' })
);
