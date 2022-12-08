import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from 'react-native';

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
      paddingLeft: 16,
      paddingVertical: 16,
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
    flex: 1,
  },
  searchInputActive: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 20,
    flex: 1,
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
  navigation: StackNavigationProp<AuthStackParamList>;
};
export default function LocationSelectionScreen({
  navigation,
}: LocationSelectionScreenInput): JSX.Element {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(null);
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
              if (selectedLocation?.id)
                navigation.navigate('SignUpScreen', {
                  id: selectedLocation.id,
                  name: selectedLocation.name,
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
  }, [selectedLocation?.id, selectedLocation?.name, navigation]);

  useEffect(() => {
    const loadLocations = async () => {
      const locationsData = await LocationsService.loadLocations();
      setLocations(locationsData);
    };
    loadLocations();
  }, []);

  return (
    <ScrollView style={style.content}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#54565A',
          borderBottomWidth: 1,
          paddingBottom: 16,
          marginRight: 16,
          flex: 1,
        }}
      >
        <Image style={style.searchIcon} source={Theme.icons.white.search} />
        <TextInput
          style={searchText ? style.searchInputActive : style.searchInput}
          value={searchText}
          onChangeText={(str) => setSearchText(str)}
          placeholderTextColor="#54565A"
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
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{ paddingVertical: 24 }}>
        {locations.map((location) =>
          location?.name.toLowerCase().includes(searchText.toLowerCase()) ? (
            <TouchableOpacity
              key={location.id}
              style={style.listItem}
              onPress={() => setSelectedLocation(location)}
            >
              <Text style={style.listText}>{location.name}</Text>
              {selectedLocation?.id === location.id && (
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
  );
}
