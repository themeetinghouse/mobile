import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import {
  TextInput,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { Auth } from '@aws-amplify/auth';
import * as SecureStore from 'expo-secure-store';
import { RouteProp } from '@react-navigation/native';
import UserContext, { TMHCognitoUser, UserData } from '../contexts/UserContext';
import LocationContext, { LocationData } from '../contexts/LocationContext';
import LocationsService from '../services/LocationsService';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { MainStackParamList } from '../navigation/AppNavigator';
import SearchBar from '../components/SearchBar';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      paddingTop: 16,
      paddingLeft: 16,
      paddingRight: 0,
      paddingBottom: 150,
    },
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
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
    color: Theme.colors.grey3,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    flex: 1,
    marginLeft: 20,
  },
  searchInputActive: {
    color: Theme.colors.white,
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 20,
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.gray2,
    paddingTop: 16,
  },
  listText: {
    flex: 1,
    borderColor: '#1A1A1A',
    borderBottomWidth: 1,
    paddingBottom: 16,
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilySemiBold,
  },
  listCheckIcon: {
    ...Style.icon,
    position: 'absolute',
    right: 20,
    alignSelf: 'center',
  },
});

type LocationSelectionScreenInput = {
  navigation: StackNavigationProp<MainStackParamList>;
  route: RouteProp<MainStackParamList, 'LocationSelectionScreen'>;
};

export default function LocationSelectionScreen({
  navigation,
  route,
}: LocationSelectionScreenInput): JSX.Element {
  const location = useContext(LocationContext);
  const userContext = useContext(UserContext);

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(
    location?.locationData
  );
  const [searchText, setSearchText] = useState('');

  const { setUserData } = userContext;
  const { persist } = route.params;
  // eslint-disable-next-line camelcase
  const emailVerified = userContext?.userData?.email_verified;

  useLayoutEffect(() => {
    async function updateUser(locationId: string | undefined) {
      if (locationId && emailVerified) {
        try {
          const user: TMHCognitoUser = await Auth.currentAuthenticatedUser();
          setUserData({
            ...user.attributes,
            'custom:home_location': locationId,
          } as UserData);
          await Auth.updateUserAttributes(user, {
            ...user.attributes,
            'custom:home_location': locationId,
          });
        } catch (e) {
          console.debug(e);
        }
      } else if (locationId) {
        try {
          await SecureStore.setItemAsync('location', locationId);
        } catch (e) {
          console.debug(e);
        }
      }
    }

    navigation.setOptions({
      headerShown: true,
      title: 'Location',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            accessibilityLabel="Cancel and navigate back to the home screen"
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
          >
            <Text style={style.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Save location, and navigate back to home screen"
            onPress={() => {
              location?.setLocationData(selectedLocation);
              if (persist) updateUser(selectedLocation?.locationId);
              navigation.goBack();
            }}
          >
            <Text style={style.headerButtonText}>Done</Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
  }, [
    location,
    navigation,
    persist,
    emailVerified,
    selectedLocation,
    setUserData,
  ]);

  useEffect(() => {
    const loadLocations = () => {
      const locationsResult = LocationsService.loadLocationDataForContext();
      setLocations(
        locationsResult.sort((a, b) =>
          (a?.locationName as string).localeCompare(b?.locationName as string)
        )
      );
    };
    loadLocations();
  }, []);

  return (
    <View style={{ backgroundColor: 'black' }}>
      <ScrollView style={style.content}>
        <SearchBar
          style={{ marginRight: 16 }}
          searchText={searchText}
          handleTextChanged={(newStr) => setSearchText(newStr)}
          placeholderLabel="Search by name or location..."
        />
        <View style={{ paddingVertical: 24 }}>
          {locations.map((item) =>
            item?.locationName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ? (
              <TouchableOpacity
                accessibilityRole="button"
                key={item.locationId}
                style={style.listItem}
                onPress={() => setSelectedLocation(item)}
              >
                <Text style={style.listText}>{item.locationName}</Text>

                {selectedLocation?.locationId === item.locationId && (
                  <Image
                    style={style.listCheckIcon}
                    source={Theme.icons.white.check}
                  />
                )}
              </TouchableOpacity>
            ) : null
          )}
        </View>
      </ScrollView>
    </View>
  );
}
