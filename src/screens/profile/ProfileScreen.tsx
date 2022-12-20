import React, { useContext, useLayoutEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  CompositeNavigationProp,
  CommonActions,
} from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import LocationContext from '../../contexts/LocationContext';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import UserContext from '../../contexts/UserContext';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.background,
  },
  header: {
    backgroundColor: Theme.colors.header,
  },
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
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
  listItem: {
    height: 73,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    lineHeight: 24,
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
  listArrowIcon: {
    ...Style.icon,
    right: 18,
    alignSelf: 'flex-start',
    top: 16,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
}

export default function Profile({ navigation }: Params): JSX.Element {
  const user = useContext(UserContext);
  const isLoggedIn = user?.userData?.email_verified;
  const location = useContext(LocationContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Profile',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
      },
      headerLeft: function render() {
        return <View style={{ flex: 1 }} />;
      },
      headerRight: function render() {
        return (
          <TouchableOpacity
            style={{
              height: 48,
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={style.headerButtonText}>Done</Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 0 },
    });
  }, [navigation]);

  const signOut = async () => {
    await Auth.signOut().then(() => {
      user?.setUserData(null);
      location?.setLocationData({
        id: 'unknown',
        name: 'unknown',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Main' }],
        })
      );
    });
  };
  const signedInItems = [
    {
      id: 'mycomments',
      text: 'My Comments',
      subtext: 'All your comments in one place',
      icon: Theme.icons.white.comments,
      action: () => navigation.navigate('MyComments'),
    },
    {
      id: 'myaccount',
      text: 'My Account',
      subtext: 'Email, password and location',
      icon: Theme.icons.white.account,
      action: () => navigation.navigate('AccountScreen'),
    },
  ];
  const signedOutItems = [
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
  const items = isLoggedIn ? signedInItems : signedOutItems;
  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      style={style.content}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          delayPressIn={100}
          key={item.id}
          style={style.listItem}
          onPress={item.action}
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
              <Image style={style.listIcon} source={item.icon} />
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
                  borderBottomWidth: index !== items.length - 1 ? 2 : 0,
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
        </TouchableOpacity>
      ))}
      {isLoggedIn ? (
        <>
          <View
            style={{
              height: 15,
              backgroundColor: Theme.colors.background,
              padding: 0,
            }}
          />
          <TouchableOpacity style={style.listItem} onPress={signOut}>
            <Image style={style.listIcon} source={Theme.icons.white.signOut} />

            <Text style={style.listText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </ScrollView>
  );
}
