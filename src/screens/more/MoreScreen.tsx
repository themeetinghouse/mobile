import React, { useContext, useLayoutEffect, useState } from 'react';
import {
  Container,
  Content,
  Text,
  Left,
  Button,
  View,
  Thumbnail,
  List,
  ListItem,
} from 'native-base';
import { ImageSourcePropType, Platform, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import UserContext from '../../contexts/UserContext';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';
import LocationContext from '../../contexts/LocationContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
    },
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  title: {
    ...Style.title,
    ...{
      marginTop: 130,
      marginBottom: 16,
    },
  },
  listItem: {
    marginLeft: 0,
    borderColor: Theme.colors.gray2,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
  },
  listSubtext: {
    fontSize: Theme.fonts.smallMedium,
    color: Theme.colors.gray5,
    fontFamily: Theme.fonts.fontFamilyRegular,
  },
  listIcon: {
    ...Style.icon,
    ...{
      marginRight: 16,
      marginLeft: 16,
    },
  },
  listArrowIcon: { ...Style.icon, right: 10 },
  icon: Style.icon,
});

type LinkItem = {
  action: () => void;
  id: string;
  text: string;
  subtext: string;
  icon: string;
};

type JSONMenuLinkItem = {
  name: string;
  subtext: string;
  location: string;
  groups: Array<string>;
  external: boolean;
};

export default function MoreScreen(): JSX.Element {
  const location = useContext(LocationContext);
  const user = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  // eslint-disable-next-line camelcase
  const emailVerified = user?.userData?.email_verified;
  let items: Array<LinkItem>;
  if (location?.locationData?.locationId === 'unknown')
    items = [
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
        action: () =>
          Linking.openURL('https://www.themeetinghouse.com/connect'),
      },
      {
        id: 'staff',
        text: 'Staff Team',
        subtext: 'Contact a staff member directly',
        icon: Theme.icons.white.staff,
        action: () => navigation.navigate('StaffList'),
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
  else {
    items = [
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
        action: () =>
          Linking.openURL('https://www.themeetinghouse.com/connect'),
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
  }
  const [menuItems, setMenuItems] = useState(items);

  const getUserType = async () => {
    try {
      const userType: CognitoUser = await Auth.currentAuthenticatedUser();
      return userType.getSignInUserSession()?.getAccessToken()?.payload?.[
        'cognito:groups'
      ];
    } catch (err) {
      return null;
    }
  };
  const loadMenu = async () => {
    try {
      const response: any = await fetch(
        'https://www.themeetinghouse.com/static/app/menu.json'
      ); // this returns status 200 even when fail
      if (response?.headers?.map?.['content-type'] === 'application/json') {
        const jsonItems: Array<JSONMenuLinkItem> = await response.json();
        const groups = await getUserType();
        if (groups) {
          const transformedItems: Array<LinkItem> = jsonItems
            .filter((linkItem) => {
              for (let i = 0; i < linkItem.groups.length; i++) {
                return groups.includes(linkItem.groups[i]);
              }
              return false;
            })
            .map((a: JSONMenuLinkItem) => {
              return {
                id: a.name,
                location: a.location,
                text: a.name,
                subtext: a.subtext,
                icon: Theme.icons.black.frame,
                action: () => {
                  if (a.external) return Linking.openURL(a.location);
                  return null; // perform navigation here
                },
              };
            });
          setMenuItems((prev) => [...transformedItems, ...prev]);
        }
      }
    } catch (err) {
      // err
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'More',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return <View style={{ flex: 1 }} />;
      },
      headerRight: function render() {
        return (
          <Button
            icon
            transparent
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Thumbnail
              square
              source={
                emailVerified
                  ? Theme.icons.white.userLoggedIn
                  : Theme.icons.white.user
              }
              style={style.icon}
            />
          </Button>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });

    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailVerified, navigation]);

  return (
    <Container>
      <Content style={style.content}>
        <View>
          <List>
            {menuItems.slice(0, 4).map((item) => {
              return (
                <ListItem
                  key={item.id}
                  style={style.listItem}
                  onPress={item.action}
                >
                  <Left>
                    <Thumbnail
                      style={style.listIcon}
                      source={item.icon as ImageSourcePropType}
                      square
                    />
                    <View>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>
                  </Left>
                  <View>
                    <Thumbnail
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                      square
                    />
                  </View>
                </ListItem>
              );
            })}

            <View
              style={{
                height: 15,
                backgroundColor: Theme.colors.background,
                padding: 0,
              }}
            />

            {menuItems.slice(4).map((item) => {
              return (
                <ListItem
                  key={item.id}
                  style={style.listItem}
                  onPress={item.action}
                >
                  <Left>
                    <Thumbnail
                      style={style.listIcon}
                      source={item.icon as ImageSourcePropType}
                      square
                    />
                    <View>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>
                  </Left>
                  <View>
                    <Thumbnail
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                      square
                    />
                  </View>
                </ListItem>
              );
            })}
          </List>
        </View>
      </Content>
    </Container>
  );
}
