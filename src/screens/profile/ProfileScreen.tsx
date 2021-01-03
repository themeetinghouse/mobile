import React, { useContext, useLayoutEffect } from 'react';
import {
  Content,
  Text,
  Left,
  View,
  Thumbnail,
  List,
  ListItem,
  Container,
} from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  CompositeNavigationProp,
  CommonActions,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import LocationContext from '../../contexts/LocationContext';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import UserContext from '../../contexts/UserContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.background,
    },
  },
  header: {
    backgroundColor: Theme.colors.header,
  },
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
    right: 6,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  headerButtonText: HeaderStyle.linkText,
  title: {
    ...Style.title,
    ...{
      marginTop: 130,
      marginBottom: 16,
    },
  },
  body: {
    ...Style.body,
    ...{
      marginBottom: 40,
    },
  },
  searchIcon: Style.icon,
  searchInput: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.medium,
  },
  listItem: {
    marginLeft: 0,
    borderColor: Theme.colors.gray2,
    backgroundColor: 'black',
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
  listArrowIcon: Style.icon,
  headerText: {
    fontSize: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    lineHeight: 24,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
}

export default function Profile({ navigation }: Params): JSX.Element {
  const safeArea = useSafeAreaInsets();
  const user = useContext(UserContext);
  const location = useContext(LocationContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Profile',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return <View style={{ flex: 1 }} />;
      },
      headerRight: function render() {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={style.headerButtonText}>Done</Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
  }, [navigation]);

  const signOut = async () => {
    await Auth.signOut().then(() => {
      user?.setUserData(null);
      location?.setLocationData({
        locationId: 'unknown',
        locationName: 'unknown',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Main' }],
        })
      );
    });
  };
  const loggedIn = () => {
    const items = [
      {
        id: 'mycomments',
        text: 'My Comments',
        subtext: 'This feature is coming soon',
        icon: Theme.icons.white.comments,
        action: () => null,
      },
      {
        id: 'myaccount',
        text: 'My Account',
        subtext: 'Email, password and location',
        icon: Theme.icons.white.account,
        action: () => navigation.navigate('AccountScreen'),
      },
    ];
    return (
      <Content style={style.content}>
        <View>
          <List>
            {items.map((item) => (
              <ListItem
                key={item.id}
                style={style.listItem}
                onPress={item.action}
              >
                <Left>
                  <Thumbnail style={style.listIcon} source={item.icon} square />
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
            ))}
            <View
              style={{
                height: 15,
                backgroundColor: Theme.colors.background,
                padding: 0,
              }}
            />
            <ListItem style={style.listItem} onPress={signOut}>
              <Left>
                <Thumbnail
                  style={style.listIcon}
                  source={Theme.icons.white.signOut}
                  square
                />
                <View>
                  <Text style={style.listText}>Sign Out</Text>
                </View>
              </Left>
            </ListItem>
          </List>
        </View>
      </Content>
    );
  };
  const notLoggedIn = () => {
    const items = [
      {
        id: 'signup',
        text: "Don't have an account?",
        subtext: 'Create one today',
        icon: Theme.icons.white.signUp,
        action: () => navigation.navigate('Auth', { screen: 'SignUpScreen' }),
      },
      {
        id: 'signin',
        text: 'Forgot to sign in?',
        subtext: 'Back to login',
        icon: Theme.icons.white.account,
        action: () => navigation.navigate('Auth', { screen: 'LoginScreen' }),
      },
    ];
    return (
      <Content style={style.content}>
        <View>
          <List>
            {items.map((item) => (
              <ListItem
                key={item.id}
                style={style.listItem}
                onPress={item.action}
              >
                <Left>
                  <Thumbnail style={style.listIcon} source={item.icon} square />
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
            ))}
          </List>
        </View>
      </Content>
    );
  };
  return (
    <Container
      style={{
        backgroundColor: Theme.colors.background,
        paddingBottom: safeArea.bottom,
      }}
    >
      {/* eslint-disable-next-line camelcase */}
      {user?.userData?.email_verified ? loggedIn() : notLoggedIn()}
    </Container>
  );
}
