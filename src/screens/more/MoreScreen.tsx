import React, { useContext, useLayoutEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { ScrollView } from 'react-native-gesture-handler';
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    height: 72,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
  },
  listSubtext: {
    fontSize: Theme.fonts.smallMedium,
    lineHeight: 24,
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
  listArrowIcon: {
    ...Style.icon,
    right: 18,
    alignSelf: 'flex-start',
    top: 16,
  },
  icon: Style.icon,
});

type LinkItem = {
  action: () => void;
  id: string;
  text: string;
  subtext: string;
  icon: string;
  customIcon?: boolean;
};

type JSONMenuLinkItem = {
  name: string;
  subtext: string;
  location: string;
  groups: Array<string>;
  icon: string;
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
        'https://www.themeetinghouse.com/static/app/data/menu.json'
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
                icon: a.icon,
                customIcon: true,
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Image
              source={
                emailVerified
                  ? Theme.icons.white.userLoggedIn
                  : Theme.icons.white.user
              }
              style={style.icon}
            />
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });

    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailVerified, navigation]);

  return (
    <View style={style.content}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.slice(0, 4).map((item, index) => {
          return (
            <TouchableHighlight
              delayPressIn={100}
              key={item.id}
              style={style.listItem}
              onPress={item.action}
              underlayColor={Theme.colors.gray3}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    top: 14,
                  }}
                >
                  {item.customIcon ? (
                    <Image style={style.listIcon} source={{ uri: item.icon }} />
                  ) : (
                    <Image
                      style={style.listIcon}
                      source={item.icon as ImageSourcePropType}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                      index !== 3
                        ? {
                            borderColor: Theme.colors.gray2,
                            borderBottomWidth: 2,
                          }
                        : {},
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>

                    <Image
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                    />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          );
        })}

        <View
          style={{
            height: 15,
            backgroundColor: Theme.colors.background,
            padding: 0,
          }}
        />

        {menuItems.slice(4).map((item, index) => {
          return (
            <TouchableHighlight
              delayPressIn={100}
              key={item.id}
              style={style.listItem}
              onPress={item.action}
              underlayColor={Theme.colors.gray6}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    top: 14,
                  }}
                >
                  <Image
                    style={style.listIcon}
                    source={item.icon as ImageSourcePropType}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: Theme.colors.gray2,
                      borderBottomWidth: 2,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>

                    <Image
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                    />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    </View>
  );
}
