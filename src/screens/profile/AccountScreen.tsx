import React, { useContext, useLayoutEffect, useState } from 'react';
import { Container, Text, View, Image, List, Button } from 'native-base';
import { ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import UserContext from '../../contexts/UserContext';
import LocationsService from '../../services/LocationsService';
import { MainStackParamList } from '../../navigation/AppNavigator';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: 'black',
    },
  },
  groupPillContainer: {
    paddingLeft: 8,
    marginTop: 20,
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderColor: Theme.colors.gray2,
    backgroundColor: Theme.colors.background,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupPill: {
    backgroundColor: Theme.colors.gray4,
    borderRadius: 50,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  groupPillText: {
    textTransform: 'capitalize',
    color: Theme.colors.grey5,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Theme.fonts.fontFamilyBold,
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
  listItem2: {
    marginLeft: 0,
    borderColor: Theme.colors.gray2,
    backgroundColor: Theme.colors.background,
  },
  listItem: {
    marginLeft: 0,
    borderColor: Theme.colors.gray2,
    backgroundColor: 'black',
  },
  listText2: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyRegular,
    marginLeft: 16,
  },
  listText3: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.grey5,
    fontFamily: Theme.fonts.fontFamilyRegular,
    marginLeft: 16,
  },
  listText: {
    fontSize: 14,
    color: Theme.colors.grey4,
    fontFamily: Theme.fonts.fontFamilyBold,
    marginLeft: 16,
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
    ...{
      marginLeft: 5,
    },
  },
  headerText: {
    fontSize: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    lineHeight: 24,
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

export default function Account({ navigation }: Params): JSX.Element {
  const user = useContext(UserContext);
  const safeArea = useSafeAreaInsets();
  const [groups, setGroups] = useState([]);
  const getUserType = async (): Promise<void> => {
    try {
      const userType: CognitoUser = await Auth.currentAuthenticatedUser();
      const userGroups = userType.getSignInUserSession()?.getAccessToken()
        ?.payload?.['cognito:groups'];
      setGroups(userGroups);
    } catch (err) {
      setGroups([]);
    }
  };
  useLayoutEffect(() => {
    getUserType();
    navigation.setOptions({
      headerShown: true,
      title: 'My Account',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <Button onPress={() => navigation.navigate('ProfileScreen')}>
            <Image
              style={Style.icon}
              source={Theme.icons.white.arrowLeft}
              alt="left icon"
            />
          </Button>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  const homeLocation = user?.userData?.['custom:home_location'];

  const items = [
    'Login',
    {
      id: 'email',
      text: 'Email',
      data: user?.userData?.email,
    },
    {
      id: 'pass',
      text: 'Password',
      icon: Theme.icons.grey.arrow,
      action: () => navigation.navigate('ChangePasswordScreen'),
    },
    'Location',
    {
      id: 'loc',
      text: 'Location',
      icon: Theme.icons.grey.arrow,
      data:
        homeLocation && homeLocation !== 'unknown'
          ? LocationsService.mapLocationIdToName(homeLocation)
          : 'None Selected',
      action: () =>
        navigation.navigate('LocationSelectionScreen', { persist: true }),
    },
  ];

  return (
    <Container
      style={{
        backgroundColor: Theme.colors.black,
        paddingBottom: safeArea.bottom,
      }}
    >
      <ScrollView style={[style.content, { flex: 1 }]}>
        <View>
          <List>
            {items.map((item) => {
              if (typeof item === 'string')
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      style.listItem,
                      { height: 50, alignItems: 'flex-end', paddingBottom: 4 },
                    ]}
                  >
                    <Text style={style.listText}>{item}</Text>
                  </TouchableOpacity>
                );
              return (
                <TouchableOpacity
                  key={item.id}
                  style={style.listItem2}
                  onPress={item.action ? item.action : () => null}
                >
                  <View>
                    <Text style={style.listText2}>{item.text}</Text>
                  </View>

                  <View
                    style={{
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {item.data ? (
                      <Text numberOfLines={1} style={style.listText3}>
                        {item.data}
                      </Text>
                    ) : null}
                    {item.icon ? (
                      <Image
                        style={style.listArrowIcon}
                        source={item.icon}
                        alt="icon"
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </List>
          <View style={{ marginTop: 20 }}>
            <Text style={style.listText}>Groups</Text>
            <View style={style.groupPillContainer}>
              {groups.map((a) => (
                <View key={a} style={style.groupPill}>
                  <Text style={style.groupPillText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
