import { useContext } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../Theme.style';
import LocationContext from '../../contexts/LocationContext';

export type LinkItem = {
  action: () => void;
  id: string;
  text: string;
  subtext: string;
  icon: string;
  customIcon?: boolean;
};
function useFallbackItems(): Array<LinkItem> {
  const location = useContext(LocationContext);
  const navigation = useNavigation();
  const fallbackMenu = [
    {
      id: 'give',
      text: 'Give',
      subtext: 'Donate to The Meeting House',
      icon: Theme.icons.white.give,
      action: () => Linking.openURL('https://www.themeetinghouse.com/give'),
    },
    // { id: "volunteer", text: "Volunteer", subtext: "Help out your local community", icon: Theme.icons.white.volunteer },
    {
      id: 'connect',
      text: 'Connect',
      subtext: 'Looking to connect with us?',
      icon: Theme.icons.white.connect,
      action: () => Linking.openURL('https://www.themeetinghouse.com/connect'),
    },
    {
      id: 'staff',
      text: 'Staff Team',
      subtext: 'Contact a staff member directly',
      icon: Theme.icons.white.staff,
      action: () => navigation.navigate('StaffList'),
    },
    {
      id: 'parish',
      text: 'My Parish Team',
      subtext: 'Contact a parish team member',
      icon: Theme.icons.white.staff,
      action: () => navigation.navigate('ParishTeam'),
    },
    {
      id: 'homeChurch',
      text: 'Home Church',
      subtext: 'Find a home church near you',
      icon: Theme.icons.white.homeChurch,
      action: () => navigation.navigate('HomeChurchScreen', {}),
    },
    {
      id: 'volunteer',
      text: 'Volunteer',
      subtext: 'Get involved!',
      icon: Theme.icons.white.volunteer,
      action: () =>
        Linking.openURL('https://www.themeetinghouse.com/volunteer'),
    },
    {
      id: 'betaTest',
      text: 'Beta Test',
      subtext: 'Help us improve this app',
      icon: Theme.icons.white.volunteer,
      action: () =>
        Platform.OS === 'ios'
          ? Linking.openURL('https://testflight.apple.com/join/y06dCmo4')
          : Linking.openURL(
              'https://play.google.com/store/apps/details?id=org.tmh.takenote'
            ),
    },
  ];
  console.log('locationId', location?.locationData?.locationId);
  return fallbackMenu.filter(
    (item) =>
      location?.locationData?.locationId !== 'unknown' ||
      (location?.locationData?.locationId === 'unknown' && item.id !== 'parish')
  );
}
export default useFallbackItems;
