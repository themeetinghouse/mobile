import React, { useState, useEffect, useLayoutEffect, Component } from 'react';
import { Text, Image, Input } from 'native-base';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import LocationsService from '../../services/LocationsService';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { LocationData } from '../../contexts/LocationContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      padding: 16,
      paddingBottom: 150,
    },
  },
  header: {
    backgroundColor: Theme.colors.header,
  },
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
    marginLeft: 20,
  },
  searchInputActive: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 20,
  },
  listItem: {
    marginLeft: 0,
    borderColor: Theme.colors.gray3,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilySemiBold,
  },
  listCheckIcon: Style.icon,
});

type LocationSelectionScreenInput = {
  navigation: StackNavigationProp<AuthStackParamList>;
};
export default function LocationSelectionScreen({
  navigation,
}: LocationSelectionScreenInput): JSX.Element {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>();
  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Location',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={style.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <TouchableOpacity
            onPress={() => {
              if (selectedLocation?.locationId)
                navigation.navigate('SignUpScreen', {
                  locationId: selectedLocation.locationId,
                  locationName: selectedLocation.locationName,
                });
              else navigation.goBack();
            }}
          >
            <Text style={style.headerButtonText}>Done</Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
  }, [
    selectedLocation?.locationId,
    selectedLocation?.locationName,
    navigation,
  ]);
  const renderLocations = (): Element[] => {
    const z = locations.map((location) =>
      location?.locationName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ? (
        <TouchableOpacity
          key={location.locationId}
          style={style.listItem}
          onPress={() => setSelectedLocation(location)}
        >
          <Text style={style.listText}>{location.locationName}</Text>
          {selectedLocation?.locationId === location.locationId && (
            <Image
              style={style.listCheckIcon}
              source={Theme.icons.white.check}
              alt="check icon"
            />
          )}
        </TouchableOpacity>
      ) : null
    );
    return z.filter((x) => x != null) as Element[];
  };

  useEffect(() => {
    const loadLocations = () => {
      const locationsResult = LocationsService.loadLocationDataForContext();
      setLocations(
        locationsResult.sort((a, b) =>
          (a?.locationName ?? '').localeCompare(b?.locationName ?? '')
        )
      );
    };
    loadLocations();
  }, []);

  return (
    <Component style={{ backgroundColor: 'black' }}>
      <ScrollView style={style.content}>
        <View>
          <Image
            style={style.searchIcon}
            source={Theme.icons.white.search}
            alt="search icon"
          />
          <Input
            style={searchText ? style.searchInputActive : style.searchInput}
            value={searchText}
            onChangeText={(str) => setSearchText(str)}
            placeholder="Search locations..."
          />
          {searchText ? (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
              }}
            >
              <Image
                style={style.searchIcon}
                accessibilityLabel="Close Location Search"
                source={Theme.icons.white.closeCancel}
                alt="close icon"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{ paddingVertical: 24 }}>{renderLocations()}</View>
      </ScrollView>
    </Component>
  );
}
